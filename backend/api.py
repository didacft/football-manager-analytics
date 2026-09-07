from pathlib import Path

import duckdb
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


ROOT_DIR = Path(__file__).resolve().parents[1]
DATABASE_PATH = ROOT_DIR / "data" / "transfermarkt-datasets.duckdb"


app = FastAPI(
    title="Football Manager Analytics API",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "database": DATABASE_PATH.name,
    }


@app.get("/api/players")
def get_players():
    con = duckdb.connect(
        str(DATABASE_PATH),
        read_only=True,
    )

    query = """
    WITH season_stats AS (
        SELECT
            a.player_id,

            STRING_AGG(
                DISTINCT club.name,
                ', '
            ) AS season_clubs,

            STRING_AGG(
                DISTINCT comp.name,
                ', '
            ) AS leagues,

            COUNT(*) AS appearances,

            COALESCE(
                SUM(a.minutes_played),
                0
            ) AS minutes,

            COALESCE(
                SUM(a.goals),
                0
            ) AS goals,

            COALESCE(
                SUM(a.assists),
                0
            ) AS assists

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
        CAST(p.player_id AS VARCHAR) AS id,

        p.name,

        COALESCE(
            p.image_url,
            ''
        ) AS image_url,

        COALESCE(
            p.country_of_citizenship,
            ''
        ) AS country,

        EXTRACT(
            YEAR FROM age(
                current_date,
                p.date_of_birth
            )
        )::INTEGER AS age,

        p.date_of_birth,

        COALESCE(
            p.current_club_name,
            ''
        ) AS current_club,

        COALESCE(
            s.season_clubs,
            ''
        ) AS season_clubs,

        COALESCE(
            s.leagues,
            ''
        ) AS leagues,

        COALESCE(
            p.sub_position,
            p.position,
            ''
        ) AS sub_position,

        COALESCE(
            p.market_value_in_eur,
            0
        )::BIGINT AS market_value,

        s.appearances::INTEGER AS appearances,

        s.minutes::INTEGER AS minutes,

        s.goals::INTEGER AS goals,

        s.assists::INTEGER AS assists,

        CASE
            WHEN s.minutes > 0
            THEN ROUND(
                s.goals * 90.0 / s.minutes,
                3
            )
            ELSE 0
        END AS g_90,

        CASE
            WHEN s.minutes > 0
            THEN ROUND(
                s.assists * 90.0 / s.minutes,
                3
            )
            ELSE 0
        END AS a_90,

        CASE
            WHEN s.minutes > 0
            THEN ROUND(
                (s.goals + s.assists) * 90.0 / s.minutes,
                3
            )
            ELSE 0
        END AS ga_90,

        p.foot,

        p.height_in_cm AS height,

        p.contract_expiration_date AS contract_until

    FROM players AS p

    JOIN season_stats AS s
        ON p.player_id = s.player_id

    WHERE p.last_season = '2025'
      AND s.minutes > 0

    ORDER BY s.minutes DESC
    """

    result = con.execute(query)

    columns = [
        description[0]
        for description in result.description
    ]

    rows = [
        dict(zip(columns, row))
        for row in result.fetchall()
    ]

    con.close()

    return rows