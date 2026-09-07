import {
  Scale,
  UserRound,
  X,
} from 'lucide-react';

import type { Player } from '../types';
import { getCountryFlagUrl } from '../utils/flags';
import {
  formatCurrency,
  getClubBadge,
} from '../utils/formatting';

interface PlayerComparisonModalProps {
  players: Player[];
  onClose: () => void;
  onRemovePlayer: (player: Player) => void;
}

export function PlayerComparisonModal({
  players,
  onClose,
  onRemovePlayer,
}: PlayerComparisonModalProps) {
  const metrics = [
    {
      label: 'Market value',
      getValue: (player: Player) =>
        formatCurrency(player.market_value),
    },
    {
      label: 'Age',
      getValue: (player: Player) =>
        player.age.toString(),
    },
    {
      label: 'Appearances',
      getValue: (player: Player) =>
        player.appearances.toString(),
    },
    {
      label: 'Minutes',
      getValue: (player: Player) =>
        player.minutes.toLocaleString(),
    },
    {
      label: 'Goals',
      getValue: (player: Player) =>
        player.goals.toString(),
    },
    {
      label: 'Assists',
      getValue: (player: Player) =>
        player.assists.toString(),
    },
    {
      label: 'Goals / 90',
      getValue: (player: Player) =>
        player.g_90.toFixed(2),
    },
    {
      label: 'Assists / 90',
      getValue: (player: Player) =>
        player.a_90.toFixed(2),
    },
    {
      label: 'G+A / 90',
      getValue: (player: Player) =>
        player.ga_90.toFixed(2),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-2">
              <Scale className="h-5 w-5 text-indigo-300" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Player Comparison
              </h2>

              <p className="text-xs text-slate-500">
                Compare up to three players using verified project metrics
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-400 transition hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          <div
            className={`grid gap-4 ${
              players.length === 1
                ? 'grid-cols-1'
                : players.length === 2
                  ? 'md:grid-cols-2'
                  : 'md:grid-cols-3'
            }`}
          >
            {players.map((player) => {
              const clubBadge =
                player.club_logo ||
                getClubBadge(
                  player.current_club
                );

              return (
                <div
                  key={player.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
                        {player.image_url ? (
                          <img
                            src={
                              player.image_url
                            }
                            alt={
                              player.name
                            }
                            className="h-full w-full object-cover"
                            onError={(
                              event
                            ) => {
                              event.currentTarget.style.display =
                                'none';
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <UserRound className="h-6 w-6 text-slate-500" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-base font-bold text-white">
                            {
                              player.name
                            }
                          </h3>

                          <img
                            src={getCountryFlagUrl(
                              player.country
                            )}
                            alt={
                              player.country
                            }
                            className="h-4 w-6 rounded-sm object-cover"
                          />
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          {
                            player.sub_position
                          }
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      title="Remove from comparison"
                      onClick={() =>
                        onRemovePlayer(
                          player
                        )
                      }
                      className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-500 transition hover:border-red-500/40 hover:text-red-300"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-slate-800 pt-4">
                    {clubBadge && (
                      <img
                        src={clubBadge}
                        alt={
                          player.current_club
                        }
                        className="h-6 w-6 object-contain"
                      />
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-300">
                        {
                          player.current_club
                        }
                      </p>

                      <p className="truncate text-[10px] text-slate-500">
                        {
                          player.leagues
                        }
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {metrics.map(
                      (metric) => (
                        <div
                          key={
                            metric.label
                          }
                          className="flex items-center justify-between border-b border-slate-800/60 py-2 last:border-b-0"
                        >
                          <span className="text-xs text-slate-500">
                            {
                              metric.label
                            }
                          </span>

                          <span
                            className={`text-sm font-semibold ${
                              metric.label ===
                              'G+A / 90'
                                ? 'text-emerald-300'
                                : 'text-slate-200'
                            }`}
                          >
                            {metric.getValue(
                              player
                            )}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}