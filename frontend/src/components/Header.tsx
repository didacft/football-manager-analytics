import {
  Bookmark,
  Download,
  GitCompareArrows,
  Search,
} from 'lucide-react';

import type { LocalhostConfig } from '../types';

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
  onTabChange: (
    tab: 'table' | 'scatter' | 'pitch'
  ) => void;
}

const tabs = [
  {
    id: 'table' as const,
    label: 'Player Database',
  },
  {
    id: 'scatter' as const,
    label: 'Value Map',
  },
  {
    id: 'pitch' as const,
    label: 'Squad Depth',
  },
];

function connectionLabel(
  status: LocalhostConfig['status']
) {
  if (status === 'connected') {
    return 'Live data';
  }

  if (status === 'checking') {
    return 'Connecting';
  }

  if (status === 'error') {
    return 'Offline';
  }

  return 'Disconnected';
}

function connectionDotClass(
  status: LocalhostConfig['status']
) {
  if (status === 'connected') {
    return 'bg-emerald-400';
  }

  if (status === 'checking') {
    return 'bg-amber-400';
  }

  return 'bg-slate-600';
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
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0a0d12]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-7 lg:px-10">
        {/* Top bar */}
        <div className="flex h-16 items-center gap-6">
          {/* Brand */}
          <div className="flex min-w-fit items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04]">
              <span className="text-sm font-bold tracking-tight text-white">
                FM
              </span>
            </div>

            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold tracking-[-0.01em] text-slate-100">
                  Football Manager Analytics
                </h1>

                <span className="hidden font-mono text-[10px] text-slate-600 lg:inline">
                  didacft
                </span>
              </div>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Scouting terminal
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mx-auto hidden w-full max-w-xl md:block">
            <div className="group relative">
              <Search
                size={15}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 transition-colors group-focus-within:text-slate-400"
              />

              <input
                value={searchQuery}
                onChange={(event) =>
                  onSearchChange(event.target.value)
                }
                placeholder="Search player, club or country..."
                className="h-9 w-full rounded-lg border border-white/[0.07] bg-white/[0.035] pl-10 pr-4 text-[13px] text-slate-200 outline-none transition placeholder:text-slate-600 hover:border-white/[0.1] focus:border-white/[0.14] focus:bg-white/[0.05]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={onOpenLocalhostModal}
              className="mr-2 hidden items-center gap-2 rounded-md px-2.5 py-2 text-xs text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-300 xl:flex"
              title={localhostConfig.errorMessage}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${connectionDotClass(
                  localhostConfig.status
                )}`}
              />

              {connectionLabel(
                localhostConfig.status
              )}
            </button>

            <button
              type="button"
              onClick={onOpenShortlist}
              className="group flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-100"
            >
              <Bookmark
                size={15}
                strokeWidth={1.8}
                className="text-slate-500 transition group-hover:text-slate-300"
              />

              <span className="hidden sm:inline">
                Shortlist
              </span>

              {shortlistCount > 0 && (
                <span className="min-w-5 rounded-full bg-white/[0.07] px-1.5 py-0.5 text-center font-mono text-[10px] text-slate-300">
                  {shortlistCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenComparison}
              className="group flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-100"
            >
              <GitCompareArrows
                size={15}
                strokeWidth={1.8}
                className="text-slate-500 transition group-hover:text-slate-300"
              />

              <span className="hidden sm:inline">
                Compare
              </span>

              {comparisonCount > 0 && (
                <span className="min-w-5 rounded-full bg-white/[0.07] px-1.5 py-0.5 text-center font-mono text-[10px] text-slate-300">
                  {comparisonCount}
                </span>
              )}
            </button>

            <div className="mx-1 h-4 w-px bg-white/[0.08]" />

            <button
              type="button"
              onClick={onExportData}
              className="group flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium text-slate-400 transition hover:bg-white/[0.05] hover:text-slate-100"
            >
              <Download
                size={15}
                strokeWidth={1.8}
                className="text-slate-500 transition group-hover:text-slate-300"
              />

              <span className="hidden lg:inline">
                Export
              </span>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
            />

            <input
              value={searchQuery}
              onChange={(event) =>
                onSearchChange(event.target.value)
              }
              placeholder="Search players..."
              className="h-9 w-full rounded-lg border border-white/[0.07] bg-white/[0.035] pl-10 pr-4 text-[13px] text-slate-200 outline-none placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex h-11 items-end justify-between">
          <nav className="flex h-full items-end gap-7">
            {tabs.map((tab) => {
              const isActive =
                activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    onTabChange(tab.id)
                  }
                  className={`relative h-full text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-slate-100'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab.label}

                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden h-full items-center pb-px text-[11px] text-slate-600 sm:flex">
            <span className="font-mono text-slate-400">
              {filteredPlayersCount.toLocaleString()}
            </span>

            <span className="ml-1.5">
              players
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}