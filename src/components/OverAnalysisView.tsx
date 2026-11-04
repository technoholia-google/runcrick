import React, { useState } from 'react';
import { Match, BallDelivery } from '../types/cricket';
import { Filter, TrendingUp, BarChart2 } from 'lucide-react';

interface OverAnalysisViewProps {
  match: Match;
}

export const OverAnalysisView: React.FC<OverAnalysisViewProps> = ({ match }) => {
  const [commentaryFilter, setCommentaryFilter] = useState<'all' | 'boundaries' | 'wickets'>('all');
  const [selectedInningsIdx, setSelectedInningsIdx] = useState<number>(match.currentInningsIndex);

  const innings = match.innings[selectedInningsIdx];

  // Calculate over-by-over progression for Innings 1 and Innings 2
  const calculateInningsProgression = (innIdx: number) => {
    const inn = match.innings[innIdx];
    const totalOvers = match.totalOvers;
    const oversData: { over: number; runs: number; cumulativeRuns: number; wickets: number }[] = [];

    let runningRuns = 0;
    let runningWickets = 0;

    // For Innings 1: if deliveries array is empty because it's a completed preset, simulate standard realistic progression up to totalRuns
    if (inn.deliveries.length === 0 && inn.totalRuns > 0) {
      const avgPerOver = inn.totalRuns / totalOvers;
      for (let o = 1; o <= totalOvers; o++) {
        // distribute with slight variance
        const variance = (Math.sin(o * 1.5) * 3);
        const overRuns = Math.max(2, Math.round(avgPerOver + variance));
        runningRuns = Math.min(inn.totalRuns, runningRuns + overRuns);
        if (o === totalOvers) runningRuns = inn.totalRuns;

        // check wickets in this over from fallOfWickets
        const wktCount = inn.fallOfWickets.filter((f) => Math.floor(parseFloat(f.over)) + 1 === o).length;
        runningWickets += wktCount;

        oversData.push({
          over: o,
          runs: overRuns,
          cumulativeRuns: runningRuns,
          wickets: runningWickets,
        });
      }
      return oversData;
    }

    // For innings with deliveries
    const currentCompletedOvers = Math.ceil(inn.legalBalls / 6);
    let prevCumRuns = 0;
    let prevCumWickets = 0;

    for (let o = 1; o <= Math.max(1, currentCompletedOvers); o++) {
      const deliveriesInOver = inn.deliveries.filter((d) => d.overNumber === o - 1);
      const runsInOver = deliveriesInOver.reduce((sum, d) => sum + d.totalRuns, 0);
      const wicketsInOver = deliveriesInOver.filter((d) => d.isWicket).length;

      prevCumRuns += runsInOver;
      prevCumWickets += wicketsInOver;

      // Ensure at least partial data matches totalRuns
      const currentCumRuns = o === currentCompletedOvers ? inn.totalRuns : prevCumRuns;

      oversData.push({
        over: o,
        runs: runsInOver,
        cumulativeRuns: currentCumRuns,
        wickets: prevCumWickets,
      });
    }

    return oversData;
  };

  const inn1Progression = calculateInningsProgression(0);
  const inn2Progression = calculateInningsProgression(1);

  // SVG Chart Dimensions
  const chartWidth = 700;
  const chartHeight = 260;
  const padding = { top: 20, right: 30, bottom: 40, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const maxRuns = Math.max(200, match.innings[0].totalRuns + 20, match.innings[1].totalRuns + 20);
  const totalOvers = match.totalOvers;

  const getX = (over: number) => padding.left + (over / totalOvers) * innerWidth;
  const getY = (runs: number) => padding.top + innerHeight - (runs / maxRuns) * innerHeight;

  // Build SVG path
  const buildLinePath = (data: typeof inn1Progression) => {
    if (data.length === 0) return '';
    let path = `M ${getX(0)} ${getY(0)}`;
    data.forEach((pt) => {
      path += ` L ${getX(pt.over)} ${getY(pt.cumulativeRuns)}`;
    });
    return path;
  };

  // Filter commentary
  const allDeliveries = [...innings.deliveries].reverse();
  const filteredDeliveries = allDeliveries.filter((del) => {
    if (commentaryFilter === 'boundaries') return del.strikerRuns === 4 || del.strikerRuns === 6;
    if (commentaryFilter === 'wickets') return del.isWicket;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Run Worm Chart Card */}
      <div className="bg-[#0b1a2e] border border-[#1a365d] rounded-2xl p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Innings Run Worm & Over-by-Over Comparison
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cumulative run progression and comparative run-rate trajectory.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-amber-400 rounded-full" />
              <span className="text-slate-200">{match.innings[0].battingTeamName} (Inn 1)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-sky-400 rounded-full" />
              <span className="text-slate-200">{match.innings[1].battingTeamName} (Inn 2)</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto bg-[#071322]/80 rounded-xl p-3 border border-[#142c4c]">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto min-w-[550px]">
            {/* Grid Lines */}
            {[0, 50, 100, 150, 200].map((r) => (
              <g key={r}>
                <line
                  x1={padding.left}
                  y1={getY(r)}
                  x2={chartWidth - padding.right}
                  y2={getY(r)}
                  stroke="#173559"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 8}
                  y={getY(r) + 4}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  {r}
                </text>
              </g>
            ))}

            {/* X-axis ticks (Overs) */}
            {[0, 5, 10, 15, 20].map((o) => (
              <g key={o}>
                <line
                  x1={getX(o)}
                  y1={padding.top}
                  x2={getX(o)}
                  y2={padding.top + innerHeight}
                  stroke="#142c4c"
                  strokeWidth="1"
                />
                <text
                  x={getX(o)}
                  y={padding.top + innerHeight + 16}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {o} ov
                </text>
              </g>
            ))}

            {/* Innings 1 Line (Sri Lanka Gold) */}
            <path
              d={buildLinePath(inn1Progression)}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Innings 2 Line (Sri Lanka Azure Blue) */}
            <path
              d={buildLinePath(inn2Progression)}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Innings 1 Wicket Markers */}
            {match.innings[0].fallOfWickets.map((fow) => {
              const overNum = parseFloat(fow.over);
              const cx = getX(overNum);
              const cy = getY(fow.runsAtFall);
              return (
                <circle
                  key={`inn1-wkt-${fow.wicketNumber}`}
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill="#ef4444"
                  stroke="#071322"
                  strokeWidth="1.5"
                >
                  <title>{`Wicket ${fow.wicketNumber}: ${fow.batsmanName} (${fow.runsAtFall}/${fow.wicketNumber} at ${fow.over} ov)`}</title>
                </circle>
              );
            })}

            {/* Innings 2 Wicket Markers */}
            {match.innings[1].fallOfWickets.map((fow) => {
              const overNum = parseFloat(fow.over);
              const cx = getX(overNum);
              const cy = getY(fow.runsAtFall);
              return (
                <circle
                  key={`inn2-wkt-${fow.wicketNumber}`}
                  cx={cx}
                  cy={cy}
                  r="4.5"
                  fill="#f43f5e"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                >
                  <title>{`Wicket ${fow.wicketNumber}: ${fow.batsmanName} (${fow.runsAtFall}/${fow.wicketNumber} at ${fow.over} ov)`}</title>
                </circle>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Ball-by-ball Text Commentary Timeline */}
      <div className="bg-[#0b1a2e] border border-[#1a365d] rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-4 bg-[#071322] border-b border-[#142c4c] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Ball-by-Ball Live Commentary
            </h3>
            <span className="text-xs text-slate-400">
              Innings {innings.inningsNumber} · {innings.battingTeamName} batting
            </span>
          </div>

          {/* Filter options */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 p-1 bg-[#0b1a2e] rounded-lg border border-[#142c4c]">
            <button
              onClick={() => setCommentaryFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                commentaryFilter === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Balls
            </button>
            <button
              onClick={() => setCommentaryFilter('boundaries')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                commentaryFilter === 'boundaries'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Boundaries (4/6)
            </button>
            <button
              onClick={() => setCommentaryFilter('wickets')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                commentaryFilter === 'wickets'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Wickets
            </button>
          </div>
        </div>

        {/* Deliveries list */}
        <div className="divide-y divide-[#142c4c] max-h-[500px] overflow-y-auto">
          {filteredDeliveries.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 italic">
              No deliveries match the selected filter.
            </div>
          ) : (
            filteredDeliveries.map((del) => {
              let badgeColor = 'bg-[#10253f] text-slate-200 border-[#1a365d]';
              let badgeText = del.strikerRuns.toString();

              if (del.isWicket) {
                badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold';
                badgeText = 'W';
              } else if (del.extraType) {
                badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                badgeText = del.extraType.toUpperCase();
              } else if (del.strikerRuns === 4) {
                badgeColor = 'bg-blue-600/25 text-blue-300 border-blue-500/50 font-bold';
                badgeText = '4';
              } else if (del.strikerRuns === 6) {
                badgeColor = 'bg-amber-400/25 text-amber-300 border-amber-400/60 font-black';
                badgeText = '6';
              } else if (del.strikerRuns === 0) {
                badgeColor = 'bg-[#071322] text-slate-500 border-[#142c4c]';
                badgeText = '•';
              }

              return (
                <div key={del.id} className="p-4 hover:bg-[#10253f]/30 transition-colors flex items-start gap-3.5">
                  <div
                    className={`min-w-[32px] h-8 rounded-lg border flex items-center justify-center text-xs font-mono-num shrink-0 ${badgeColor}`}
                  >
                    {badgeText}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono-num font-bold text-amber-400">
                        {del.scoreAtEnd.oversDisplay}
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-xs font-semibold text-slate-200">
                        {del.bowlerName} to {del.strikerName}
                      </span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400 font-mono-num">
                        Score: {del.scoreAtEnd.runs}/{del.scoreAtEnd.wickets}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {del.commentary}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
