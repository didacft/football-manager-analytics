import duckdb
import pycountry
import requests
import streamlit as st

def country_to_flag_url(country_name):
    special_codes = {
        "England": "gb",
        "Scotland": "gb",
        "Wales": "gb",
        "Northern Ireland": "gb",
    }

    if country_name in special_codes:
        code = special_codes[country_name]
    else:
        try:
            code = pycountry.countries.lookup(country_name).alpha_2.lower()
        except LookupError:
            return None

    return f"https://flagcdn.com/w80/{code}.png"

@st.cache_data(ttl=86400)
def get_club_logo(club_name):
    url = "https://v3.football.api-sports.io/teams"

    headers = {
        "x-apisports-key": st.secrets["API_FOOTBALL_KEY"]
    }

    aliases = {
        "FC Barcelona": "Barcelona",
        "Liverpool FC": "Liverpool",
        "Manchester City": "Manchester City",
        "Paris Saint-Germain": "Paris Saint Germain",
    }

    search_name = aliases.get(club_name, club_name)

    response = requests.get(
        url,
        headers=headers,
        params={"search": search_name},
        timeout=10
    )

    if response.status_code == 429:
        return None

    response.raise_for_status()

    teams = response.json().get("response", [])

    if teams:
        return teams[0]["team"].get("logo")

    return None

st.title("⚽ Football Manager Analytics")
st.caption("Interactive football scouting using performance and market-value data.")

con = duckdb.connect(
    "data/transfermarkt-datasets.duckdb",
    read_only=True
)

positions = con.execute("""
    SELECT DISTINCT sub_position
    FROM players
    WHERE sub_position IS NOT NULL
    ORDER BY sub_position
""").fetchall()

positions = [position[0] for position in positions]

st.subheader("Player filters")

col1, col2, col3, col4 = st.columns(4)

with col1:
    position = st.selectbox(
        "Position",
        positions,
        index=positions.index("Centre-Forward")
    )

with col2:
    max_age = st.slider(
        "Maximum age",
        min_value=16,
        max_value=40,
        value=23
    )

with col3:
    max_value_m = st.slider(
        "Maximum market value (€M)",
        min_value=1,
        max_value=200,
        value=40
    )

with col4:
    min_minutes = st.slider(
        "Minimum minutes played",
        min_value=0,
        max_value=3000,
        value=700,
        step=100
    )

max_value = max_value_m * 1_000_000

players = con.execute("""
    WITH season_stats AS (
        SELECT
            a.player_id,
            STRING_AGG(DISTINCT club.name, ', ') AS season_clubs,
            STRING_AGG(DISTINCT comp.name, ', ') AS leagues,
            COUNT(*) AS appearances,
            SUM(a.minutes_played) AS minutes,
            SUM(a.goals) AS goals,
            SUM(a.assists) AS assists
        FROM appearances AS a
        JOIN games AS g
            ON CAST(a.game_id AS VARCHAR) = g.game_id
        LEFT JOIN clubs AS club
            ON CAST(a.player_club_id AS VARCHAR) = club.club_id
        JOIN competitions AS comp
            ON g.competition_id = comp.competition_id
        WHERE g.season = '2025'
          AND g.competition_type = 'domestic_league'
        GROUP BY a.player_id
    )

    SELECT
        p.name AS Player,
        p.image_url AS image_url,
        p.country_of_citizenship AS country,
        EXTRACT(YEAR FROM age(current_date, p.date_of_birth)) AS Age,
        p.current_club_name AS "Current club",
        s.season_clubs AS "Season club(s)",
        s.leagues AS "League(s)",
        p.market_value_in_eur AS "Market value",
        s.appearances AS Apps,
        s.minutes AS Minutes,
        s.goals AS Goals,
        s.assists AS Assists,
        ROUND(s.goals * 90.0 / s.minutes, 2) AS "G/90",
        ROUND(s.assists * 90.0 / s.minutes, 2) AS "A/90",
        ROUND((s.goals + s.assists) * 90.0 / s.minutes, 2) AS "G+A/90"
    FROM players AS p
    JOIN season_stats AS s
        ON p.player_id = s.player_id
    WHERE p.last_season = '2025'
      AND p.sub_position = ?
      AND p.market_value_in_eur <= ?
      AND p.date_of_birth IS NOT NULL
      AND EXTRACT(YEAR FROM age(current_date, p.date_of_birth)) <= ?
      AND s.minutes >= ?
    ORDER BY "G+A/90" DESC, s.minutes DESC
    LIMIT 50
""", [
    position,
    max_value,
    max_age,
    min_minutes
]).fetchdf()

con.close()

st.divider()

st.subheader(f"Scouting results · {len(players)} players")

display_players = players.drop(columns=["image_url", "country"])

event = st.dataframe(
    display_players,
    key="player_table",
    use_container_width=True,
    hide_index=True,
    on_select="rerun",
    selection_mode="single-row-required",
    column_config={
        "Market value": st.column_config.NumberColumn(
            "Market value",
            format="€%d"
        ),
        "G/90": st.column_config.NumberColumn("G/90", format="%.2f"),
        "A/90": st.column_config.NumberColumn("A/90", format="%.2f"),
        "G+A/90": st.column_config.NumberColumn("G+A/90", format="%.2f")
    }
)

if event.selection.rows:
    selected_index = event.selection.rows[0]
    player = players.iloc[selected_index]

    st.divider()
    st.subheader("Player profile")

    image_col, info_col = st.columns([1, 3])

    with image_col:
        if player["image_url"]:
            st.image(player["image_url"], width=220)

    with info_col:
        name_col, logo_col = st.columns([4, 1])

        with name_col:
            st.title(player["Player"])
        with logo_col:
            club_logo = get_club_logo(player["Current club"])

            if club_logo:
                st.image(club_logo, width=80)
        
        flag_url = country_to_flag_url(player["country"])
        if flag_url:
            st.markdown(
                f'**Country:** <img src="{flag_url}" width="28"> &nbsp; {player["country"]}',
                unsafe_allow_html=True
            )
        else:
            st.write(f"**Country:** {player['country']}")
        st.write(f"**Current club:** {player['Current club']}")
        st.write(f"**Season club(s):** {player['Season club(s)']}")
        st.write(f"**League(s):** {player['League(s)']}")
        st.write(f"**Age:** {player['Age']}")
        st.write(f"**Market value:** €{player['Market value']:,}")

        metric1, metric2, metric3, metric4 = st.columns(4)

        metric1.metric("Goals", player["Goals"])
        metric2.metric("Assists", player["Assists"])
        metric3.metric("G/90", player["G/90"])
        metric4.metric("G+A/90", player["G+A/90"])