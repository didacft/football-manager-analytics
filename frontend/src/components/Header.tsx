import type { LocalhostConfig } from '../types';
import {
  Bookmark,
  Download,
  Radio,
  Scale,
  Search,
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  localhostConfig: LocalhostConfig;
  onOpenLocalhostModal: () => void;
  shortlistCount: number;
  onOpenShortlist: () => void;
  comparisonCount: number;
  onOpenComparison: () => void;
  onExportData: () => void;
  filteredPlayersCount: number;
  activeTab: 'table' | 'scatter' | 'pitch';
  onTabChange: (tab: 'table' | 'scatter' | 'pitch') => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  localhostConfig,
  onOpenLocalhostModal,
  shortlistCount,
  onOpenShortlist,
  comparisonCount,
  onOpenComparison,
  onExportData,
  filteredPlayersCount,
  activeTab,
  onTabChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900 shadow-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-xl font-black text-white shadow-lg shadow-emerald-950/40">
            ⚽
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
                Football Manager Analytics

                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300">
                  didacft
                </span>
              </h1>
            </div>

            <p className="text-xs text-slate-400">
              Interactive scouting dashboard using performance metrics &
              market-value data
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenLocalhostModal}
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              localhostConfig.status === 'connected'
                ? 'border-emerald-600/60 bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60'
                : localhostConfig.status === 'checking'
                  ? 'animate-pulse border-amber-600/60 bg-amber-950/60 text-amber-300'
                  : 'border-slate-700 bg-slate-800/90 text-slate-300 hover:border-slate-500 hover:text-white'
            }`}
          >
            <Radio
              className={`h-3.5 w-3.5 ${
                localhostConfig.status === 'connected'
                  ? 'animate-pulse text-emerald-400'
                  : 'text-slate-400'
              }`}
            />

            <span>
              {localhostConfig.status === 'connected'
                ? 'Localhost: Connected'
                : localhostConfig.status === 'checking'
                  ? 'Connecting...'
                  : 'Data Source: Ready'}
            </span>

            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </button>

          <button
            type="button"
            onClick={onOpenShortlist}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-slate-500 hover:text-white"
          >
            <Bookmark className="h-3.5 w-3.5 text-amber-400" />
            <span>Shortlist</span>

            {shortlistCount > 0 && (
              <span className="ml-1 rounded-full border border-amber-500/30 bg-amber-500/20 px-1.5 text-[10px] font-bold text-amber-300">
                {shortlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenComparison}
            disabled={comparisonCount === 0}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              comparisonCount > 0
                ? 'border-indigo-500/60 bg-indigo-950/80 text-indigo-200 hover:bg-indigo-900/80'
                : 'cursor-not-allowed border-slate-800 bg-slate-800/50 text-slate-500'
            }`}
          >
            <Scale className="h-3.5 w-3.5 text-indigo-400" />
            <span>Compare</span>

            {comparisonCount > 0 && (
              <span className="ml-1 rounded-full bg-indigo-500/30 px-1.5 text-[10px] font-bold text-indigo-200">
                {comparisonCount}/3
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onExportData}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="border-t border-slate-800/80 bg-slate-950/60 px-4 py-2 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-1 rounded-xl border border-slate-800 bg-slate-900 p-1">
            <button
              type="button"
              onClick={() => onTabChange('table')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'table'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              Scouting Table ({filteredPlayersCount})
            </button>

            <button
              type="button"
              onClick={() => onTabChange('scatter')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'scatter'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              Quadrant & Value Chart
            </button>

            <button
              type="button"
              onClick={() => onTabChange('pitch')}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'pitch'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              Pitch Squad Depth
            </button>
          </div>

          <div className="relative min-w-[240px] max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search player, club, or nationality..."
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900 py-1.5 pl-9 pr-8 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}