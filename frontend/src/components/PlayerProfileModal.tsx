import {
  Bookmark,
  CalendarDays,
  Clock3,
  Scale,
  Shield,
  UserRound,
  X,
} from 'lucide-react';

import type { Player } from '../types';
import { getCountryFlagUrl } from '../utils/flags';
import {
  formatCurrency,
  getClubBadge,
} from '../utils/formatting';

interface PlayerProfileModalProps {
  player: Player;
  isShortlisted: boolean;
  isComparing: boolean;
  onClose: () => void;
  onToggleShortlist: (player: Player) => void;
  onToggleComparison: (player: Player) => void;
}

export function PlayerProfileModal({
  player,
  isShortlisted,
  isComparing,
  onClose,
  onToggleShortlist,
  onToggleComparison,
}: PlayerProfileModalProps) {
  const clubBadge =
    player.club_logo || getClubBadge(player.current_club);

  const metrics = [
    {
      label: 'Appearances',
      value: player.appearances,
    },
    {
      label: 'Minutes',
      value: player.minutes.toLocaleString(),
    },
    {
      label: 'Goals',
      value: player.goals,
    },
    {
      label: 'Assists',
      value: player.assists,
    },
    {
      label: 'Goals / 90',
      value: player.g_90.toFixed(2),
    },
    {
      label: 'Assists / 90',
      value: player.a_90.toFixed(2),
    },
    {
      label: 'G+A / 90',
      value: player.ga_90.toFixed(2),
      highlight: true,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg border border-slate-700 bg-slate-900/80 p-2 text-slate-400 transition hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
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
                  <UserRound className="h-10 w-10 text-slate-500" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-white">
                  {player.name}
                </h2>

                <img
                  src={getCountryFlagUrl(player.country)}
                  alt={player.country}
                  title={player.country}
                  className="h-5 w-7 rounded-sm object-cover"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  {player.sub_position}
                </span>

                <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  Age {player.age}
                </span>

                <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300">
                  {player.country}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  {clubBadge ? (
                    <img
                      src={clubBadge}
                      alt={player.current_club}
                      className="h-8 w-8 object-contain"
                    />
                  ) : (
                    <Shield className="h-6 w-6 text-slate-500" />
                  )}

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">
                      Current club
                    </p>

                    <p className="text-sm font-semibold text-slate-200">
                      {player.current_club}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    Market value
                  </p>

                  <p className="text-lg font-bold text-emerald-300">
                    {formatCurrency(player.market_value)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className={`rounded-xl border p-4 ${
                  metric.highlight
                    ? 'border-emerald-500/30 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-950/60'
                }`}
              >
                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  {metric.label}
                </p>

                <p
                  className={`mt-1 text-xl font-bold ${
                    metric.highlight
                      ? 'text-emerald-300'
                      : 'text-white'
                  }`}
                >
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="mb-4 text-sm font-semibold text-white">
                Season context
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <Shield className="mt-0.5 h-4 w-4 text-slate-500" />

                  <div>
                    <p className="text-xs text-slate-500">
                      Season club(s)
                    </p>

                    <p className="text-slate-200">
                      {player.season_clubs}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 text-slate-500" />

                  <div>
                    <p className="text-xs text-slate-500">
                      League(s)
                    </p>

                    <p className="text-slate-200">
                      {player.leagues}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock3 className="mt-0.5 h-4 w-4 text-slate-500" />

                  <div>
                    <p className="text-xs text-slate-500">
                      Playing time
                    </p>

                    <p className="text-slate-200">
                      {player.minutes.toLocaleString()} minutes
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <h3 className="mb-3 text-sm font-semibold text-white">
                Data availability
              </h3>

              <p className="text-xs leading-5 text-slate-400">
                This profile currently uses only metrics backed by the
                project data. Advanced scouting metrics such as xG, xA,
                progressive passes or defensive actions will appear only
                when a verified data source is connected.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={() => onToggleShortlist(player)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                isShortlisted
                  ? 'border-amber-500/40 bg-amber-500/20 text-amber-300'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Bookmark
                className="h-4 w-4"
                fill={isShortlisted ? 'currentColor' : 'none'}
              />

              {isShortlisted
                ? 'Remove from shortlist'
                : 'Add to shortlist'}
            </button>

            <button
              type="button"
              onClick={() => onToggleComparison(player)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                isComparing
                  ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Scale className="h-4 w-4" />

              {isComparing
                ? 'Remove from comparison'
                : 'Add to comparison'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}