import { useEffect, useMemo, useState } from 'react';

import { FilterBar } from './components/FilterBar';
import { Header } from './components/Header';
import { PlayerComparisonModal } from './components/PlayerComparisonModal';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { PlayerTable } from './components/PlayerTable';
import { ScatterPlotView } from './components/ScatterPlotView';
import { ShortlistDrawer } from './components/ShortlistDrawer';

import type {
  FilterState,
  LocalhostConfig,
  Player,
} from './types';

const API_BASE_URL = 'http://127.0.0.1:8000';

const DEFAULT_FILTERS: FilterState = {
  position: 'All',
  maxAge: 40,
  maxMarketValue: 250_000_000,
  minMinutes: 700,
  league: 'All',
  searchQuery: '',
  sortBy: 'ga_90',
  sortOrder: 'desc',
};

function App() {
  const [players, setPlayers] = useState<Player[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState<string | null>(null);

  const [filters, setFilters] =
    useState<FilterState>(DEFAULT_FILTERS);

  const [activeTab, setActiveTab] = useState<
    'table' | 'scatter' | 'pitch'
  >('table');

  const [selectedPlayer, setSelectedPlayer] =
    useState<Player | null>(null);

  const [shortlistIds, setShortlistIds] =
    useState<string[]>([]);

  const [comparisonIds, setComparisonIds] =
    useState<string[]>([]);

  const [isShortlistOpen, setIsShortlistOpen] =
    useState(false);

  const [isComparisonOpen, setIsComparisonOpen] =
    useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadPlayers() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const response = await fetch(
          `${API_BASE_URL}/api/players`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `API request failed with status ${response.status}`
          );
        }

        const data = (await response.json()) as Player[];

        setPlayers(data);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            return;
          }

          setLoadError(error.message);
        } else {
          setLoadError('Unable to load player data.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadPlayers();

    return () => {
      controller.abort();
    };
  }, []);

  const localhostConfig: LocalhostConfig = {
    url: API_BASE_URL,
    status: isLoading
      ? 'checking'
      : loadError
        ? 'error'
        : 'connected',
    errorMessage: loadError ?? undefined,
  };

  const availablePositions = useMemo(
    () =>
      [
        ...new Set(
          players
            .map((player) => player.sub_position)
            .filter(Boolean)
        ),
      ].sort(),
    [players]
  );

  const availableLeagues = useMemo(() => {
    const leagues = players.flatMap((player) =>
      player.leagues
        .split(',')
        .map((league) => league.trim())
        .filter(Boolean)
    );

    return [...new Set(leagues)].sort();
  }, [players]);

  const filteredPlayers = useMemo(() => {
    const search =
      filters.searchQuery.trim().toLowerCase();

    const filtered = players.filter((player) => {
      const matchesPosition =
        filters.position === 'All' ||
        player.sub_position === filters.position;

      const matchesAge =
        player.age <= filters.maxAge;

      const matchesValue =
        player.market_value <=
        filters.maxMarketValue;

      const matchesMinutes =
        player.minutes >= filters.minMinutes;

      const matchesLeague =
        filters.league === 'All' ||
        player.leagues
          .split(',')
          .map((league) =>
            league.trim().toLowerCase()
          )
          .includes(
            filters.league.toLowerCase()
          );

      const matchesSearch =
        search === '' ||
        player.name
          .toLowerCase()
          .includes(search) ||
        player.current_club
          .toLowerCase()
          .includes(search) ||
        player.country
          .toLowerCase()
          .includes(search);

      return (
        matchesPosition &&
        matchesAge &&
        matchesValue &&
        matchesMinutes &&
        matchesLeague &&
        matchesSearch
      );
    });

    return [...filtered].sort((a, b) => {
      const aValue = Number(
        a[filters.sortBy] ?? 0
      );

      const bValue = Number(
        b[filters.sortBy] ?? 0
      );

      if (filters.sortOrder === 'asc') {
        return aValue - bValue;
      }

      return bValue - aValue;
    });
  }, [players, filters]);

  const shortlistedPlayers = useMemo(
    () =>
      players.filter((player) =>
        shortlistIds.includes(player.id)
      ),
    [players, shortlistIds]
  );

  const comparisonPlayers = useMemo(
    () =>
      players.filter((player) =>
        comparisonIds.includes(player.id)
      ),
    [players, comparisonIds]
  );

  function handleFilterChange<
    K extends keyof FilterState,
  >(
    key: K,
    value: FilterState[K]
  ) {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleSort(
    column: FilterState['sortBy']
  ) {
    setFilters((current) => ({
      ...current,
      sortBy: column,
      sortOrder:
        current.sortBy === column &&
        current.sortOrder === 'desc'
          ? 'asc'
          : 'desc',
    }));
  }

  function toggleShortlist(player: Player) {
    setShortlistIds((current) =>
      current.includes(player.id)
        ? current.filter(
            (id) => id !== player.id
          )
        : [...current, player.id]
    );
  }

  function toggleComparison(player: Player) {
    setComparisonIds((current) => {
      if (current.includes(player.id)) {
        return current.filter(
          (id) => id !== player.id
        );
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, player.id];
    });
  }

  function removeComparisonPlayer(
    player: Player
  ) {
    setComparisonIds((current) => {
      const updated = current.filter(
        (id) => id !== player.id
      );

      if (updated.length === 0) {
        setIsComparisonOpen(false);
      }

      return updated;
    });
  }

  function exportCsv() {
    const headers = [
      'Name',
      'Age',
      'Position',
      'Current Club',
      'Season Clubs',
      'League',
      'Market Value EUR',
      'Appearances',
      'Minutes',
      'Goals',
      'Assists',
      'G/90',
      'A/90',
      'G+A/90',
    ];

    const rows = filteredPlayers.map(
      (player) => [
        player.name,
        player.age,
        player.sub_position,
        player.current_club,
        player.season_clubs,
        player.leagues,
        player.market_value,
        player.appearances,
        player.minutes,
        player.goals,
        player.assists,
        player.g_90,
        player.a_90,
        player.ga_90,
      ]
    );

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replaceAll(
                '"',
                '""'
              )}"`
          )
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;

    link.download =
      'football-manager-analytics.csv';

    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header
        searchQuery={filters.searchQuery}
        onSearchChange={(query) =>
          handleFilterChange(
            'searchQuery',
            query
          )
        }
        localhostConfig={localhostConfig}
        onOpenLocalhostModal={() => {}}
        shortlistCount={
          shortlistIds.length
        }
        onOpenShortlist={() =>
          setIsShortlistOpen(true)
        }
        comparisonCount={
          comparisonIds.length
        }
        onOpenComparison={() =>
          setIsComparisonOpen(true)
        }
        onExportData={exportCsv}
        filteredPlayersCount={
          filteredPlayers.length
        }
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <FilterBar
        filters={filters}
        onFilterChange={
          handleFilterChange
        }
        availablePositions={
          availablePositions
        }
        availableLeagues={
          availableLeagues
        }
        onReset={() =>
          setFilters(DEFAULT_FILTERS)
        }
      />

      <main className="mx-auto max-w-[1600px] px-5 py-5 sm:px-7 lg:px-10">
        {isLoading && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-emerald-400" />

            <h2 className="text-sm font-semibold text-slate-200">
              Loading player data
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Reading the 2025 season from DuckDB...
            </p>
          </div>
        )}

        {!isLoading && loadError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-8">
            <h2 className="text-sm font-semibold text-red-300">
              Unable to connect to the backend
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              {loadError}
            </p>

            <p className="mt-3 text-xs text-slate-500">
              Make sure FastAPI is running on
              {' '}
              {API_BASE_URL}.
            </p>
          </div>
        )}

        {!isLoading &&
          !loadError &&
          activeTab === 'table' && (
            <PlayerTable
              players={filteredPlayers}
              filters={filters}
              onSort={handleSort}
              onSelectPlayer={
                setSelectedPlayer
              }
              shortlistIds={
                shortlistIds
              }
              comparisonIds={
                comparisonIds
              }
              onToggleShortlist={
                toggleShortlist
              }
              onToggleComparison={
                toggleComparison
              }
            />
          )}

        {!isLoading &&
          !loadError &&
          activeTab === 'scatter' && (
            <ScatterPlotView
              players={filteredPlayers}
              onSelectPlayer={
                setSelectedPlayer
              }
            />
          )}

        {!isLoading &&
          !loadError &&
          activeTab === 'pitch' && (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
              <h2 className="text-lg font-semibold text-white">
                Pitch Squad Depth
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Position-specific scouting logic will be added later.
              </p>
            </div>
          )}
      </main>

      {isShortlistOpen && (
        <ShortlistDrawer
          players={
            shortlistedPlayers
          }
          onClose={() =>
            setIsShortlistOpen(false)
          }
          onSelectPlayer={(player) => {
            setSelectedPlayer(player);
            setIsShortlistOpen(false);
          }}
          onRemovePlayer={
            toggleShortlist
          }
          onClear={() =>
            setShortlistIds([])
          }
        />
      )}

      {isComparisonOpen &&
        comparisonPlayers.length > 0 && (
          <PlayerComparisonModal
            players={comparisonPlayers}
            onClose={() =>
              setIsComparisonOpen(false)
            }
            onRemovePlayer={
              removeComparisonPlayer
            }
          />
        )}

      {selectedPlayer && (
        <PlayerProfileModal
          player={selectedPlayer}
          isShortlisted={shortlistIds.includes(
            selectedPlayer.id
          )}
          isComparing={comparisonIds.includes(
            selectedPlayer.id
          )}
          onClose={() =>
            setSelectedPlayer(null)
          }
          onToggleShortlist={
            toggleShortlist
          }
          onToggleComparison={
            toggleComparison
          }
        />
      )}
    </div>
  );
}

export default App;