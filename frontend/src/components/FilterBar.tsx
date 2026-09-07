import type { FilterState } from '../types';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';

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

export function FilterBar({
  filters,
  onFilterChange,
  availablePositions,
  availableLeagues,
  onReset,
}: FilterBarProps) {
  return (
    <section className="border-b border-slate-800 bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-emerald-400" />

            <div>
              <h2 className="text-sm font-semibold text-slate-200">
                Scouting Filters
              </h2>

              <p className="text-[11px] text-slate-500">
                Narrow the player pool using recruitment constraints
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-400 transition-colors hover:border-slate-600 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Position
            </span>

            <select
              value={filters.position}
              onChange={(event) =>
                onFilterChange('position', event.target.value)
              }
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All positions</option>

              {availablePositions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Maximum age
            </span>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min="16"
                max="40"
                value={filters.maxAge}
                onChange={(event) =>
                  onFilterChange('maxAge', Number(event.target.value))
                }
                className="w-full accent-emerald-500"
              />

              <span className="min-w-8 text-right text-xs font-semibold text-slate-200">
                {filters.maxAge}
              </span>
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Maximum market value
            </span>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={filters.maxMarketValue / 1_000_000}
                onChange={(event) =>
                  onFilterChange(
                    'maxMarketValue',
                    Number(event.target.value) * 1_000_000
                  )
                }
                className="w-full accent-emerald-500"
              />

              <span className="min-w-14 text-right text-xs font-semibold text-slate-200">
                €{Math.round(filters.maxMarketValue / 1_000_000)}M
              </span>
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Minimum minutes
            </span>

            <input
              type="number"
              min="0"
              step="100"
              value={filters.minMinutes}
              onChange={(event) =>
                onFilterChange('minMinutes', Number(event.target.value))
              }
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              League
            </span>

            <select
              value={filters.league}
              onChange={(event) =>
                onFilterChange('league', event.target.value)
              }
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All leagues</option>

              {availableLeagues.map((league) => (
                <option key={league} value={league}>
                  {league}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </section>
  );
}