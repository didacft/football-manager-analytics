import duckdb

con = duckdb.connect("data/transfermarkt-datasets.duckdb", read_only=True)

players = con.execute("""
    SELECT name, sub_position, current_club_name, market_value_in_eur
    FROM players
    WHERE last_season = '2025'
      AND market_value_in_eur IS NOT NULL
    ORDER BY market_value_in_eur DESC
    LIMIT 10
""").fetchall()

for player in players:
    print(player)

con.close()