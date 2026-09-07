import {
  ChevronDown,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

import type { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;

  onFilterChange: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void;

  availablePositions: string[];
  availableLeagues: string[];

  onReset: () => void;
}

function formatMarketValue(value: number) {
  if (value >= 1_000_000) {
    return `€${Math.round(value / 1_000_000)}M`;
  }

  if (value >= 1_000) {
    return `€${Math.round(value / 1_000)}K`;
  }

  return `€${value}`;
}

export function FilterBar({
  filters,
  onFilterChange,
  availablePositions,
  availableLeagues,
  onReset,
}: FilterBarProps) {
  return (
    <section className="border-b border-white/[0.06] bg-[#090d14]">
      <div className="mx-auto max-w-[1600px] px-5 py-4 sm:px-7 lg:px-10">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
          {/* Label */}
          <div className="flex min-w-[145px] items-center gap-2 pb-2 xl:pb-1.5">
            <SlidersHorizontal
              size={14}
              strokeWidth={1.8}
              className="text-slate-500"
            />

            <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-slate-500">
              Filters
            </span>
          </div>

          {/* Controls */}
          <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {/* Position */}
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600">
                Position
              </label>

              <div className="relative">
                <select
                  value={filters.position}
                  onChange={(event) =>
                    onFilterChange(
                      'position',
                      event.target.value
                    )
                  }
                  className="h-9 w-full appearance-none rounded-md border border-white/[0.07] bg-white/[0.025] px-3 pr-8 text-xs text-slate-300 outline-none transition hover:border-white/[0.11] focus:border-white/[0.15]"
                >
                  <option value="All">
                    All positions
                  </option>

                  {availablePositions.map((position) => (
                    <option
                      key={position}
                      value={position}
                    >
                      {position}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
                />
              </div>
            </div>

            {/* Max age */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600">
                  Max age
                </label>

                <span className="font-mono text-[10px] text-slate-400">
                  {filters.maxAge}
                </span>
              </div>

              <div className="flex h-9 items-center rounded-md border border-white/[0.07] bg-white/[0.025] px-3">
                <input
                  type="range"
                  min={16}
                  max={40}
                  value={filters.maxAge}
                  onChange={(event) =>
                    onFilterChange(
                      'maxAge',
                      Number(event.target.value)
                    )
                  }
                  className="h-1 w-full cursor-pointer accent-emerald-400"
                />
              </div>
            </div>

            {/* Market value */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600">
                  Max value
                </label>

                <span className="font-mono text-[10px] text-slate-400">
                  {formatMarketValue(
                    filters.maxMarketValue
                  )}
                </span>
              </div>

              <div className="flex h-9 items-center rounded-md border border-white/[0.07] bg-white/[0.025] px-3">
                <input
                  type="range"
                  min={5_000_000}
                  max={250_000_000}
                  step={5_000_000}
                  value={filters.maxMarketValue}
                  onChange={(event) =>
                    onFilterChange(
                      'maxMarketValue',
                      Number(event.target.value)
                    )
                  }
                  className="h-1 w-full cursor-pointer accent-emerald-400"
                />
              </div>
            </div>

            {/* Minutes */}
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600">
                Min minutes
              </label>

              <input
                type="number"
                min={0}
                step={100}
                value={filters.minMinutes}
                onChange={(event) =>
                  onFilterChange(
                    'minMinutes',
                    Math.max(
                      0,
                      Number(event.target.value)
                    )
                  )
                }
                className="h-9 w-full rounded-md border border-white/[0.07] bg-white/[0.025] px-3 font-mono text-xs text-slate-300 outline-none transition hover:border-white/[0.11] focus:border-white/[0.15]"
              />
            </div>

            {/* League */}
            <div>
              <label className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.08em] text-slate-600">
                League
              </label>

              <div className="relative">
                <select
                  value={filters.league}
                  onChange={(event) =>
                    onFilterChange(
                      'league',
                      event.target.value
                    )
                  }
                  className="h-9 w-full appearance-none rounded-md border border-white/[0.07] bg-white/[0.025] px-3 pr-8 text-xs text-slate-300 outline-none transition hover:border-white/[0.11] focus:border-white/[0.15]"
                >
                  <option value="All">
                    All leagues
                  </option>

                  {availableLeagues.map((league) => (
                    <option
                      key={league}
                      value={league}
                    >
                      {league}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* Reset */}
          <div className="flex xl:pb-0">
            <button
              type="button"
              onClick={onReset}
              className="flex h-9 items-center gap-2 rounded-md px-3 text-[11px] font-medium text-slate-600 transition hover:bg-white/[0.04] hover:text-slate-300"
            >
              <RotateCcw
                size={13}
                strokeWidth={1.8}
              />

              Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}