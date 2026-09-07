import {
  ArrowUpDown,
  Bookmark,
  Scale,
  UserRound,
} from 'lucide-react';

import type { FilterState, Player } from '../types';
import { getCountryFlagUrl } from '../utils/flags';
import { formatCurrency, getClubBadge } from '../utils/formatting';

interface PlayerTableProps {
  players: Player[];
  filters: FilterState;
  onSort: (column: FilterState['sortBy']) => void;
  onSelectPlayer: (player: Player) => void;
  shortlistIds: string[];
  comparisonIds: string[];
  onToggleShortlist: (player: Player) => void;
  onToggleComparison: (player: Player) => void;
}

export function PlayerTable({
  players,
  filters,
  onSort,
  onSelectPlayer,
  shortlistIds,
  comparisonIds,
  onToggleShortlist,
  onToggleComparison,
}: PlayerTableProps) {
  const SortButton = ({
    column,
    label,
  }: {
    column: FilterState['sortBy'];
    label: string;
  }) => (
    <button
      type="button"
      onClick={() => onSort(column)}
      className="inline-flex items-center gap-1 transition hover:text-white"
    >
      {label}
      <ArrowUpDown
        className={`h-3 w-3 ${
          filters.sortBy === column
            ? 'text-emerald-400'
            : 'text-slate-600'
        }`}
      />
    </button>
  );

  if (players.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
        <UserRound className="mx-auto mb-3 h-8 w-8 text-slate-600" />

        <h3 className="text-sm font-semibold text-slate-300">
          No players found
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Adjust the scouting filters to expand the player pool.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl shadow-black/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead className="border-b border-slate-800 bg-slate-950/80 text-[10px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Player</th>
              <th className="px-3 py-3">Age</th>
              <th className="px-3 py-3">Club</th>
              <th className="px-3 py-3">League</th>

              <th className="px-3 py-3 text-right">
                <SortButton column="market_value" label="Value" />
              </th>

              <th className="px-3 py-3 text-right">
                <SortButton column="minutes" label="Min" />
              </th>

              <th className="px-3 py-3 text-right">
                <SortButton column="goals" label="G" />
              </th>

              <th className="px-3 py-3 text-right">
                <SortButton column="assists" label="A" />
              </th>

              <th className="px-3 py-3 text-right">
                <SortButton column="g_90" label="G/90" />
              </th>

              <th className="px-3 py-3 text-right">
                <SortButton column="a_90" label="A/90" />
              </th>

              <th className="px-3 py-3 text-right">
                <SortButton column="ga_90" label="G+A/90" />
              </th>

              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/70">
            {players.map((player) => {
              const isShortlisted = shortlistIds.includes(player.id);
              const isComparing = comparisonIds.includes(player.id);
              const clubBadge =
                player.club_logo || getClubBadge(player.current_club);

              return (
                <tr
                  key={player.id}
                  onClick={() => onSelectPlayer(player)}
                  className="cursor-pointer transition-colors hover:bg-slate-800/60"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
                        {player.image_url ? (
                          <img
                            src={player.image_url}
                            alt={player.name}
                            className="h-full w-full object-cover"
                            onError={(event) => {
                                event.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <UserRound className="h-5 w-5 text-slate-500" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-slate-100">
                            {player.name}
                          </span>

                          <img
                            src={getCountryFlagUrl(player.country)}
                            alt={player.country}
                            title={player.country}
                            className="h-3.5 w-5 rounded-sm object-cover"
                          />
                        </div>

                        <span className="mt-0.5 block text-[11px] text-slate-500">
                          {player.sub_position}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-3 text-xs text-slate-300">
                    {player.age}
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      {clubBadge && (
                        <img
                          src={clubBadge}
                          alt={player.current_club}
                          className="h-6 w-6 object-contain"
                        />
                      )}

                      <div>
                        <div className="max-w-[150px] truncate text-xs font-medium text-slate-300">
                          {player.current_club}
                        </div>

                        {player.season_clubs !== player.current_club && (
                          <div
                            className="max-w-[150px] truncate text-[10px] text-slate-500"
                            title={player.season_clubs}
                          >
                            Season: {player.season_clubs}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td
                    className="max-w-[130px] truncate px-3 py-3 text-xs text-slate-400"
                    title={player.leagues}
                  >
                    {player.leagues}
                  </td>

                  <td className="px-3 py-3 text-right text-xs font-semibold text-emerald-300">
                    {formatCurrency(player.market_value)}
                  </td>

                  <td className="px-3 py-3 text-right text-xs text-slate-300">
                    {player.minutes.toLocaleString()}
                  </td>

                  <td className="px-3 py-3 text-right text-xs text-slate-300">
                    {player.goals}
                  </td>

                  <td className="px-3 py-3 text-right text-xs text-slate-300">
                    {player.assists}
                  </td>

                  <td className="px-3 py-3 text-right text-xs text-slate-300">
                    {player.g_90.toFixed(2)}
                  </td>

                  <td className="px-3 py-3 text-right text-xs text-slate-300">
                    {player.a_90.toFixed(2)}
                  </td>

                  <td className="px-3 py-3 text-right">
                    <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-xs font-bold text-emerald-300">
                      {player.ga_90.toFixed(2)}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div
                      className="flex justify-center gap-1"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        title="Add to shortlist"
                        onClick={() => onToggleShortlist(player)}
                        className={`rounded-lg border p-1.5 transition ${
                          isShortlisted
                            ? 'border-amber-500/40 bg-amber-500/20 text-amber-300'
                            : 'border-slate-700 bg-slate-800 text-slate-500 hover:text-amber-300'
                        }`}
                      >
                        <Bookmark
                          className="h-3.5 w-3.5"
                          fill={isShortlisted ? 'currentColor' : 'none'}
                        />
                      </button>

                      <button
                        type="button"
                        title="Compare player"
                        onClick={() => onToggleComparison(player)}
                        className={`rounded-lg border p-1.5 transition ${
                          isComparing
                            ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300'
                            : 'border-slate-700 bg-slate-800 text-slate-500 hover:text-indigo-300'
                        }`}
                      >
                        <Scale className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}