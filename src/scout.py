import duckdb

POSITION = input("Position: ")
MAX_AGE = int(input("Maximum age: "))
MAX_VALUE = int(input("Maximum market value (€): "))
MIN_MINUTES = int(input("Minimum minutes played: "))
SEASON = "2025"
LIMIT = 20

con = duckdb.connect("data/transfermarkt-datasets.duckdb", read_only=True)

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
        WHERE g.season = ?
          AND g.competition_type = 'domestic_league'
        GROUP BY a.player_id
    )

    SELECT
        p.name,
        EXTRACT(YEAR FROM age(current_date, p.date_of_birth)) AS age,
        p.current_club_name,
        s.season_clubs,
        s.leagues,
        p.market_value_in_eur,
        s.appearances,
        s.minutes,
        s.goals,
        s.assists,
        ROUND(s.goals * 90.0 / s.minutes, 2) AS goals_per_90,
        ROUND(s.assists * 90.0 / s.minutes, 2) AS assists_per_90,
        ROUND((s.goals + s.assists) * 90.0 / s.minutes, 2) AS ga_per_90
    FROM players AS p
    JOIN season_stats AS s
        ON p.player_id = s.player_id
    WHERE p.last_season = ?
      AND p.sub_position = ?
      AND p.market_value_in_eur <= ?
      AND p.date_of_birth IS NOT NULL
      AND EXTRACT(YEAR FROM age(current_date, p.date_of_birth)) <= ?
      AND s.minutes >= ?
    ORDER BY ga_per_90 DESC, s.minutes DESC
    LIMIT ?
""", [
    SEASON,
    SEASON,
    POSITION,
    MAX_VALUE,
    MAX_AGE,
    MIN_MINUTES,
    LIMIT
]).fetchall()

for name, age, current_club, season_clubs, leagues, value, apps, minutes, goals, assists, g90, a90, ga90 in players:
    print(
        f"{name} | Age: {age} "
        f"| Current club: {current_club} "
        f"| Season club(s): {season_clubs} "
        f"| League(s): {leagues} "
        f"| €{value:,} "
        f"| Apps: {apps} | Min: {minutes} | G: {goals} | A: {assists} "
        f"| G/90: {g90} | A/90: {a90} | G+A/90: {ga90}"
)

con.close()