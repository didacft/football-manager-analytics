import { useState } from 'react';

import {
  Bookmark,
  GitCompareArrows,
  UserRound,
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
} from 'lucide-react';

import type {
  FilterState,
  Player,
} from '../types';

import { getCountryFlagUrl } from '../utils/flags';
import { getClubBadge } from '../utils/formatting';


interface PlayerTableProps {
  players: Player[];
  filters: FilterState;

  onSort: (
    column: FilterState['sortBy']
  ) => void;

  onSelectPlayer: (
    player: Player
  ) => void;

  shortlistIds: string[];
  comparisonIds: string[];

  onToggleShortlist: (
    player: Player
  ) => void;

  onToggleComparison: (
    player: Player
  ) => void;
}


function formatMarketValue(value: number) {
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

    superliga:
      'Superliga',

    'jupiler-pro-league':
      'Jupiler Pro League',
  };

  return value
    .split(',')
    .map((league) => {
      const clean =
        league.trim();

      if (knownNames[clean]) {
        return knownNames[clean];
      }

      return clean
        .split('-')
        .map(
          (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(' ');
    })
    .join(', ');
}


function formatMetric(
  value: number
) {
  return value.toFixed(2);
}


function SortIcon({
  column,
  filters,
}: {
  column:
    FilterState['sortBy'];

  filters: FilterState;
}) {
  if (
    filters.sortBy !== column
  ) {
    return (
      <ChevronsUpDown
        size={11}
        strokeWidth={1.7}
        className="text-slate-700"
      />
    );
  }

  if (
    filters.sortOrder === 'asc'
  ) {
    return (
      <ArrowUp
        size={11}
        strokeWidth={2}
        className="text-slate-400"
      />
    );
  }

  return (
    <ArrowDown
      size={11}
      strokeWidth={2}
      className="text-slate-400"
    />
  );
}


function SortableHeader({
  label,
  column,
  filters,
  onSort,
}: {
  label: string;

  column:
    FilterState['sortBy'];

  filters: FilterState;

  onSort: (
    column:
      FilterState['sortBy']
  ) => void;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onSort(column)
      }
      className="ml-auto flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.07em] text-slate-600 transition hover:text-slate-400"
    >
      {label}

      <SortIcon
        column={column}
        filters={filters}
      />
    </button>
  );
}


function PlayerAvatar({
  player,
}: {
  player: Player;
}) {
  const [failed, setFailed] =
    useState(false);

  return (
    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white/[0.04]">
      {!failed &&
      player.image_url ? (
        <img
          src={player.image_url}
          alt={player.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() =>
            setFailed(true)
          }
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-slate-700">
          <UserRound
            size={18}
            strokeWidth={1.5}
          />
        </div>
      )}
    </div>
  );
}


function PlayerRow({
  player,
  isShortlisted,
  isComparing,
  onSelectPlayer,
  onToggleShortlist,
  onToggleComparison,
}: {
  player: Player;

  isShortlisted: boolean;

  isComparing: boolean;

  onSelectPlayer: (
    player: Player
  ) => void;

  onToggleShortlist: (
    player: Player
  ) => void;

  onToggleComparison: (
    player: Player
  ) => void;
}) {
  const clubBadge =
    getClubBadge(
      player.current_club
    );

  const flagUrl =
    getCountryFlagUrl(
      player.country
    );

  const showSeasonClub =
    player.season_clubs &&
    player.season_clubs !==
      player.current_club;

  return (
    <tr
      tabIndex={0}
      onClick={() =>
        onSelectPlayer(player)
      }
      onKeyDown={(event) => {
        if (
          event.key === 'Enter'
        ) {
          onSelectPlayer(player);
        }
      }}
      className="group cursor-pointer border-b border-white/[0.045] transition-colors hover:bg-white/[0.025] focus:bg-white/[0.025] focus:outline-none"
    >
      {/* Player */}
      <td className="py-3 pl-4 pr-5">
        <div className="flex items-center gap-3">
          <PlayerAvatar
            player={player}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate text-[13px] font-semibold tracking-[-0.01em] text-slate-100">
                {player.name}
              </span>

              {flagUrl && (
                <img
                  src={flagUrl}
                  alt={player.country}
                  title={
                    player.country
                  }
                  className="h-3 w-[18px] rounded-[2px] object-cover opacity-85"
                />
              )}
            </div>

            <div className="mt-0.5 truncate text-[10px] text-slate-600">
              {
                player.sub_position
              }
            </div>
          </div>
        </div>
      </td>

      {/* Age */}
      <td className="px-3 py-3 text-right">
        <span className="font-mono text-[12px] tabular-nums text-slate-400">
          {player.age}
        </span>
      </td>

      {/* Club */}
      <td className="px-5 py-3">
        <div className="flex items-center gap-2.5">
          {clubBadge && (
            <img
              src={clubBadge}
              alt=""
              className="h-5 w-5 shrink-0 object-contain"
              onError={(
                event
              ) => {
                event.currentTarget.style.display =
                  'none';
              }}
            />
          )}

          <div className="min-w-0">
            <div className="truncate text-[12px] font-medium text-slate-300">
              {
                player.current_club
              }
            </div>

            {showSeasonClub && (
              <div className="mt-0.5 max-w-[180px] truncate text-[9px] text-slate-650">
                Season:{' '}
                {
                  player.season_clubs
                }
              </div>
            )}
          </div>
        </div>
      </td>

      {/* League */}
      <td className="px-5 py-3">
        <span className="text-[11px] text-slate-500">
          {formatLeagueName(
            player.leagues
          )}
        </span>
      </td>

      {/* Value */}
      <td className="px-3 py-3 text-right">
        <span className="font-mono text-[12px] font-semibold tabular-nums text-slate-200">
          {formatMarketValue(
            player.market_value
          )}
        </span>
      </td>

      {/* Minutes */}
      <td className="px-3 py-3 text-right">
        <span className="font-mono text-[11px] tabular-nums text-slate-500">
          {player.minutes.toLocaleString()}
        </span>
      </td>

      {/* Goals */}
      <td className="px-3 py-3 text-right">
        <span className="font-mono text-[11px] tabular-nums text-slate-400">
          {player.goals}
        </span>
      </td>

      {/* Assists */}
      <td className="px-3 py-3 text-right">
        <span className="font-mono text-[11px] tabular-nums text-slate-400">
          {player.assists}
        </span>
      </td>

      {/* G/90 */}
      <td className="px-3 py-3 text-right">
        <span className="font-mono text-[11px] tabular-nums text-slate-400">
          {formatMetric(
            player.g_90
          )}
        </span>
      </td>

      {/* A/90 */}
      <td className="px-3 py-3 text-right">
        <span className="font-mono text-[11px] tabular-nums text-slate-400">
          {formatMetric(
            player.a_90
          )}
        </span>
      </td>

      {/* GA / 90 */}
      <td className="px-3 py-3 text-right">
        <span className="font-mono text-[11px] font-semibold tabular-nums text-emerald-300">
          {formatMetric(
            player.ga_90
          )}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3 pl-4 pr-3">
        <div
          className={`flex justify-end gap-1 transition-opacity ${
            isShortlisted ||
            isComparing
              ? 'opacity-100'
              : 'opacity-25 group-hover:opacity-100'
          }`}
        >
          <button
            type="button"
            title={
              isShortlisted
                ? 'Remove from shortlist'
                : 'Add to shortlist'
            }
            onClick={(
              event
            ) => {
              event.stopPropagation();

              onToggleShortlist(
                player
              );
            }}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
              isShortlisted
                ? 'bg-emerald-400/10 text-emerald-300'
                : 'text-slate-600 hover:bg-white/[0.05] hover:text-slate-300'
            }`}
          >
            <Bookmark
              size={13}
              strokeWidth={1.8}
              fill={
                isShortlisted
                  ? 'currentColor'
                  : 'none'
              }
            />
          </button>

          <button
            type="button"
            title={
              isComparing
                ? 'Remove from comparison'
                : 'Add to comparison'
            }
            onClick={(
              event
            ) => {
              event.stopPropagation();

              onToggleComparison(
                player
              );
            }}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
              isComparing
                ? 'bg-emerald-400/10 text-emerald-300'
                : 'text-slate-600 hover:bg-white/[0.05] hover:text-slate-300'
            }`}
          >
            <GitCompareArrows
              size={13}
              strokeWidth={1.8}
            />
          </button>
        </div>
      </td>
    </tr>
  );
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
  return (
    <section>
      {/* Database heading */}
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.015em] text-slate-100">
            Player Database
          </h2>

          <p className="mt-1 text-[11px] text-slate-600">
            <span className="font-mono text-slate-400">
              {players.length.toLocaleString()}
            </span>{' '}
            players match your scouting criteria
          </p>
        </div>

        <div className="hidden text-right sm:block">
          <div className="text-[9px] font-medium uppercase tracking-[0.09em] text-slate-700">
            Dataset
          </div>

          <div className="mt-1 font-mono text-[10px] text-slate-500">
            Domestic leagues · 2025
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-y border-white/[0.06]">
        <table className="w-full min-w-[1180px] border-collapse">
          <thead>
            <tr className="border-b border-white/[0.07]">
              <th className="w-[270px] py-2.5 pl-4 pr-5 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600">
                Player
              </th>

              <th className="w-[60px] px-3 py-2.5 text-right text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600">
                Age
              </th>

              <th className="w-[220px] px-5 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600">
                Club
              </th>

              <th className="w-[175px] px-5 py-2.5 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600">
                League
              </th>

              <th className="w-[105px] px-3 py-2.5 text-right">
                <SortableHeader
                  label="Value"
                  column="market_value"
                  filters={filters}
                  onSort={onSort}
                />
              </th>

              <th className="w-[75px] px-3 py-2.5 text-right">
                <SortableHeader
                  label="Min"
                  column="minutes"
                  filters={filters}
                  onSort={onSort}
                />
              </th>

              <th className="w-[55px] px-3 py-2.5 text-right">
                <SortableHeader
                  label="G"
                  column="goals"
                  filters={filters}
                  onSort={onSort}
                />
              </th>

              <th className="w-[55px] px-3 py-2.5 text-right">
                <SortableHeader
                  label="A"
                  column="assists"
                  filters={filters}
                  onSort={onSort}
                />
              </th>

              <th className="w-[75px] px-3 py-2.5 text-right">
                <SortableHeader
                  label="G/90"
                  column="g_90"
                  filters={filters}
                  onSort={onSort}
                />
              </th>

              <th className="w-[75px] px-3 py-2.5 text-right">
                <SortableHeader
                  label="A/90"
                  column="a_90"
                  filters={filters}
                  onSort={onSort}
                />
              </th>

              <th className="w-[90px] px-3 py-2.5 text-right">
                <SortableHeader
                  label="G+A/90"
                  column="ga_90"
                  filters={filters}
                  onSort={onSort}
                />
              </th>

              <th className="w-[80px] py-2.5 pl-4 pr-3 text-right text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {players.map(
              (player) => (
                <PlayerRow
                  key={player.id}
                  player={player}
                  isShortlisted={shortlistIds.includes(
                    player.id
                  )}
                  isComparing={comparisonIds.includes(
                    player.id
                  )}
                  onSelectPlayer={onSelectPlayer}
                  onToggleShortlist={onToggleShortlist}
                  onToggleComparison={onToggleComparison}
                />
              )
            )}
          </tbody>
        </table>
      </div>

      {players.length === 0 && (
        <div className="py-20 text-center">
          <div className="text-sm font-medium text-slate-400">
            No players found
          </div>

          <div className="mt-1 text-xs text-slate-600">
            Adjust the scouting filters to widen the player pool.
          </div>
        </div>
      )}
    </section>
  );
}