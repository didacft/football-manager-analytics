import {
  Bookmark,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';

import type { Player } from '../types';
import { getCountryFlagUrl } from '../utils/flags';
import { formatCurrency, getClubBadge } from '../utils/formatting';

interface ShortlistDrawerProps {
  players: Player[];
  onClose: () => void;
  onSelectPlayer: (player: Player) => void;
  onRemovePlayer: (player: Player) => void;
  onClear: () => void;
}

export function ShortlistDrawer({
  players,
  onClose,
  onSelectPlayer,
  onRemovePlayer,
  onClear,
}: ShortlistDrawerProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close shortlist"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-slate-700 bg-slate-900 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2">
              <Bookmark
                className="h-5 w-5 text-amber-300"
                fill="currentColor"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Scouting Shortlist
              </h2>

              <p className="text-xs text-slate-500">
                {players.length}{' '}
                {players.length === 1 ? 'player' : 'players'} saved
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

        <div className="flex-1 overflow-y-auto p-4">
          {players.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Bookmark className="mb-3 h-9 w-9 text-slate-700" />

              <h3 className="text-sm font-semibold text-slate-300">
                Your shortlist is empty
              </h3>

              <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                Save interesting players from the scouting table or player
                profile.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {players.map((player) => {
                const clubBadge =
                  player.club_logo || getClubBadge(player.current_club);

                return (
                  <div
                    key={player.id}
                    className="group flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3 transition hover:border-slate-700 hover:bg-slate-800/60"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectPlayer(player)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
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

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-white">
                            {player.name}
                          </p>

                          <img
                            src={getCountryFlagUrl(player.country)}
                            alt={player.country}
                            className="h-3.5 w-5 rounded-sm object-cover"
                          />
                        </div>

                        <div className="mt-1 flex items-center gap-2">
                          {clubBadge && (
                            <img
                              src={clubBadge}
                              alt={player.current_club}
                              className="h-4 w-4 object-contain"
                            />
                          )}

                          <span className="truncate text-xs text-slate-500">
                            {player.current_club}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-[10px] text-slate-500">
                            {player.sub_position}
                          </span>

                          <span className="text-xs font-semibold text-emerald-300">
                            {formatCurrency(player.market_value)}
                          </span>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      title="Remove from shortlist"
                      onClick={() => onRemovePlayer(player)}
                      className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-500 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {players.length > 0 && (
          <div className="border-t border-slate-800 p-4">
            <button
              type="button"
              onClick={onClear}
              className="w-full rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
            >
              Clear shortlist
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}