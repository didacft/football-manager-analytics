import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts';

import type { Player } from '../types';
import { formatCurrency } from '../utils/formatting';

interface ScatterPlotViewProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

export function ScatterPlotView({
  players,
  onSelectPlayer,
}: ScatterPlotViewProps) {
  const data = players.map((player) => ({
    ...player,
    x: player.market_value / 1_000_000,
    y: player.ga_90,
    z: Math.max(player.minutes, 1),
  }));

  const medianValue = median(data.map((player) => player.x));
  const medianPerformance = median(data.map((player) => player.y));

  if (players.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
        <h2 className="text-sm font-semibold text-slate-300">
          No players available
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Adjust the scouting filters to populate the chart.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/10">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-white">
          Performance vs Market Value
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          G+A per 90 compared with market value. Bubble size represents
          minutes played.
        </p>
      </div>

      <div className="h-[520px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{
              top: 20,
              right: 25,
              bottom: 30,
              left: 10,
            }}
          >
            <CartesianGrid
              stroke="#1e293b"
              strokeDasharray="3 3"
            />

            <XAxis
              type="number"
              dataKey="x"
              name="Market Value"
              unit="M"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
              label={{
                value: 'Market Value (€M)',
                position: 'insideBottom',
                offset: -15,
                fill: '#64748b',
                fontSize: 11,
              }}
            />

            <YAxis
              type="number"
              dataKey="y"
              name="G+A / 90"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
              label={{
                value: 'G+A / 90',
                angle: -90,
                position: 'insideLeft',
                fill: '#64748b',
                fontSize: 11,
              }}
            />

            <ZAxis
              type="number"
              dataKey="z"
              range={[80, 400]}
            />

            <ReferenceLine
              x={medianValue}
              stroke="#64748b"
              strokeDasharray="6 6"
              label={{
                value: 'Median value',
                position: 'insideTopRight',
                fill: '#64748b',
                fontSize: 10,
              }}
            />

            <ReferenceLine
              y={medianPerformance}
              stroke="#64748b"
              strokeDasharray="6 6"
              label={{
                value: 'Median performance',
                position: 'insideTopLeft',
                fill: '#64748b',
                fontSize: 10,
              }}
            />

            <Tooltip
              cursor={{
                strokeDasharray: '3 3',
                stroke: '#475569',
              }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;

                const player = payload[0].payload as Player & {
                  x: number;
                  y: number;
                };

                return (
                  <div className="rounded-lg border border-slate-700 bg-slate-950 p-3 shadow-xl">
                    <p className="font-semibold text-white">
                      {player.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {player.current_club}
                    </p>

                    <div className="mt-2 space-y-1 text-xs">
                      <p className="text-slate-300">
                        Value:{' '}
                        <span className="font-semibold text-emerald-300">
                          {formatCurrency(player.market_value)}
                        </span>
                      </p>

                      <p className="text-slate-300">
                        G+A / 90:{' '}
                        <span className="font-semibold text-white">
                          {player.ga_90.toFixed(2)}
                        </span>
                      </p>

                      <p className="text-slate-300">
                        Minutes:{' '}
                        <span className="font-semibold text-white">
                          {player.minutes.toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              }}
            />

            <Scatter
              data={data}
              fill="#10b981"
              fillOpacity={0.8}
              onClick={(point) =>
                onSelectPlayer(point as unknown as Player)
              }
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid gap-2 text-[10px] text-slate-500 sm:grid-cols-2">
        <p>
          Upper-left: stronger attacking output at lower market value.
        </p>

        <p className="sm:text-right">
          Reference lines use the median of the currently filtered players.
        </p>
      </div>
    </section>
  );
}