import { useState } from 'react';

import {
  Bookmark,
  Calendar,
  GitCompareArrows,
  Ruler,
  UserRound,
  X,
} from 'lucide-react';

import type { Player } from '../types';

import { getCountryFlagUrl } from '../utils/flags';
import { getClubBadge } from '../utils/formatting';


interface PlayerProfileModalProps {
  player: Player;

  isShortlisted: boolean;
  isComparing: boolean;

  onClose: () => void;

  onToggleShortlist: (
    player: Player
  ) => void;

  onToggleComparison: (
    player: Player
  ) => void;
}


function formatMarketValue(
  value: number
) {
  if (!value) {
    return '—';
  }

  if (value >= 1_000_000) {
    const millions =
      value / 1_000_000;

    return `€${
      Number.isInteger(millions)
        ? millions
        : millions.toFixed(1)
    }M`;
  }

  if (value >= 1_000) {
    return `€${Math.round(
      value / 1_000
    )}K`;
  }

  return `€${value}`;
}


function formatDate(
  value?: string | null
) {
  if (!value) {
    return '—';
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '—';
  }

  return new Intl.DateTimeFormat(
    'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  ).format(date);
}


function formatLeagueName(
  value: string
) {
  const knownNames: Record<
    string,
    string
  > = {
    'premier-league':
      'Premier League',

    laliga:
      'LaLiga',

    'serie-a':
      'Serie A',

    bundesliga:
      'Bundesliga',

    'ligue-1':
      'Ligue 1',

    eredivisie:
      'Eredivisie',

    'liga-portugal':
      'Liga Portugal',

    'super-lig':
      'Süper Lig',

    'scottish-premiership':
      'Scottish Premiership',
  };

  return value
    .split(',')
    .map((league) => {
      const clean =
        league.trim();

      return (
        knownNames[clean] ??
        clean
          .split('-')
          .map(
            (word) =>
              word
                .charAt(0)
                .toUpperCase() +
              word.slice(1)
          )
          .join(' ')
      );
    })
    .join(', ');
}


function PlayerPhoto({
  player,
}: {
  player: Player;
}) {
  const [failed, setFailed] =
    useState(false);

  return (
    <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03]">
      {!failed &&
      player.image_url ? (
        <img
          src={player.image_url}
          alt={player.name}
          className="h-full w-full object-cover"
          onError={() =>
            setFailed(true)
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-700">
          <UserRound
            size={38}
            strokeWidth={1.3}
          />
        </div>
      )}
    </div>
  );
}


function Metric({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="text-[9px] font-medium uppercase tracking-[0.09em] text-slate-600">
        {label}
      </div>

      <div
        className={`mt-1.5 font-mono text-lg font-semibold tabular-nums ${
          accent
            ? 'text-emerald-300'
            : 'text-slate-100'
        }`}
      >
        {value}
      </div>
    </div>
  );
}


export function PlayerProfileModal({
  player,
  isShortlisted,
  isComparing,
  onClose,
  onToggleShortlist,
  onToggleComparison,
}: PlayerProfileModalProps) {
  const flagUrl =
    getCountryFlagUrl(
      player.country
    );

  const clubBadge =
    getClubBadge(
      player.current_club
    );

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close player profile"
        onClick={onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
      />

      {/* Dossier */}
      <aside className="absolute right-0 top-0 h-full w-full max-w-[520px] overflow-y-auto border-l border-white/[0.07] bg-[#0a0e15] shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-white/[0.06] bg-[#0a0e15]/95 px-6 backdrop-blur-xl">
          <div>
            <div className="text-[9px] font-medium uppercase tracking-[0.12em] text-slate-600">
              Player dossier
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition hover:bg-white/[0.05] hover:text-slate-300"
          >
            <X
              size={17}
              strokeWidth={1.7}
            />
          </button>
        </div>

        <div className="px-7 pb-10 pt-7">
          {/* Identity */}
          <div className="flex gap-5">
            <PlayerPhoto
              player={player}
            />

            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-2xl font-semibold tracking-[-0.035em] text-white">
                  {player.name}
                </h2>

                {flagUrl && (
                  <img
                    src={flagUrl}
                    alt={player.country}
                    title={player.country}
                    className="h-3.5 w-5 rounded-[2px] object-cover"
                  />
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-slate-500">
                <span>
                  {player.sub_position}
                </span>

                <span className="text-slate-700">
                  ·
                </span>

                <span>
                  {player.age} years
                </span>

                <span className="text-slate-700">
                  ·
                </span>

                <span>
                  {player.country}
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2.5">
                {clubBadge && (
                  <img
                    src={clubBadge}
                    alt=""
                    className="h-6 w-6 object-contain"
                    onError={(
                      event
                    ) => {
                      event.currentTarget.style.display =
                        'none';
                    }}
                  />
                )}

                <span className="text-[13px] font-medium text-slate-300">
                  {player.current_club}
                </span>
              </div>
            </div>
          </div>

          {/* Market value */}
          <div className="mt-8 border-y border-white/[0.06] py-6">
            <div className="text-[9px] font-medium uppercase tracking-[0.11em] text-slate-600">
              Market value
            </div>

            <div className="mt-1 font-mono text-4xl font-semibold tracking-[-0.04em] text-slate-100">
              {formatMarketValue(
                player.market_value
              )}
            </div>
          </div>

          {/* Main statistics */}
          <div className="py-7">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.09em] text-slate-500">
                Season performance
              </h3>

              <span className="font-mono text-[10px] text-slate-700">
                Domestic league · 2025
              </span>
            </div>

            <div className="grid grid-cols-4 gap-x-4 gap-y-7">
              <Metric
                label="Apps"
                value={player.appearances}
              />

              <Metric
                label="Minutes"
                value={player.minutes.toLocaleString()}
              />

              <Metric
                label="Goals"
                value={player.goals}
              />

              <Metric
                label="Assists"
                value={player.assists}
              />

              <Metric
                label="G / 90"
                value={player.g_90.toFixed(
                  2
                )}
              />

              <Metric
                label="A / 90"
                value={player.a_90.toFixed(
                  2
                )}
              />

              <Metric
                label="G+A / 90"
                value={player.ga_90.toFixed(
                  2
                )}
                accent
              />
            </div>
          </div>

          {/* Context */}
          <div className="border-t border-white/[0.06] pt-7">
            <h3 className="mb-5 text-[11px] font-medium uppercase tracking-[0.09em] text-slate-500">
              Player context
            </h3>

            <div className="space-y-4">
              <div className="flex items-start justify-between gap-8">
                <span className="text-[11px] text-slate-600">
                  Season club(s)
                </span>

                <span className="max-w-[270px] text-right text-[11px] text-slate-300">
                  {player.season_clubs ||
                    '—'}
                </span>
              </div>

              <div className="flex items-start justify-between gap-8">
                <span className="text-[11px] text-slate-600">
                  League(s)
                </span>

                <span className="max-w-[270px] text-right text-[11px] text-slate-300">
                  {formatLeagueName(
                    player.leagues
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between gap-8">
                <span className="flex items-center gap-2 text-[11px] text-slate-600">
                  <Calendar
                    size={13}
                    strokeWidth={1.6}
                  />

                  Date of birth
                </span>

                <span className="font-mono text-[11px] text-slate-300">
                  {formatDate(
                    player.date_of_birth
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between gap-8">
                <span className="flex items-center gap-2 text-[11px] text-slate-600">
                  <Ruler
                    size={13}
                    strokeWidth={1.6}
                  />

                  Height
                </span>

                <span className="font-mono text-[11px] text-slate-300">
                  {player.height
                    ? `${player.height} cm`
                    : '—'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-8">
                <span className="text-[11px] text-slate-600">
                  Preferred foot
                </span>

                <span className="capitalize text-[11px] text-slate-300">
                  {player.foot ||
                    '—'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-8">
                <span className="text-[11px] text-slate-600">
                  Contract until
                </span>

                <span className="font-mono text-[11px] text-slate-300">
                  {formatDate(
                    player.contract_until
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-2 border-t border-white/[0.06] pt-6">
            <button
              type="button"
              onClick={() =>
                onToggleShortlist(
                  player
                )
              }
              className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-md border text-xs font-medium transition ${
                isShortlisted
                  ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                  : 'border-white/[0.08] bg-white/[0.025] text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
              }`}
            >
              <Bookmark
                size={14}
                strokeWidth={1.8}
                fill={
                  isShortlisted
                    ? 'currentColor'
                    : 'none'
                }
              />

              {isShortlisted
                ? 'Shortlisted'
                : 'Add to shortlist'}
            </button>

            <button
              type="button"
              onClick={() =>
                onToggleComparison(
                  player
                )
              }
              className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-md border text-xs font-medium transition ${
                isComparing
                  ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
                  : 'border-white/[0.08] bg-white/[0.025] text-slate-400 hover:bg-white/[0.05] hover:text-slate-200'
              }`}
            >
              <GitCompareArrows
                size={14}
                strokeWidth={1.8}
              />

              {isComparing
                ? 'In comparison'
                : 'Compare player'}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}