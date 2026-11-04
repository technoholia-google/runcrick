import React from 'react';
import { Match, BallDelivery } from '../types/cricket';
import { calculateEconomy, calculateStrikeRate } from '../utils/cricketEngine';
import { ArrowRight, Trophy, ArrowRightLeft, UserCheck } from 'lucide-react';

interface LiveScoreboardProps {
  match: Match;
  onSwapStrike: () => void;
  onChangeBowler: () => void;
}

export const LiveScoreboard: React.FC<LiveScoreboardProps> = ({
  match,
  onSwapStrike,
  onChangeBowler,
}) => {
  const currentInnings = match.innings[match.currentInningsIndex];
  const striker = currentInnings.batsmenStats[currentInnings.currentStrikerId];
  const nonStriker = currentInnings.batsmenStats[currentInnings.currentNonStrikerId];
  const bowler = currentInnings.bowlersStats[currentInnings.currentBowlerId];

  // Calculate run rates
  const oversFloat = currentInnings.legalBalls / 6;
  const crr = oversFloat > 0 ? (currentInnings.totalRuns / oversFloat).toFixed(2) : '0.00';

  const ballsRemaining = Math.max(0, match.totalOvers * 6 - currentInnings.legalBalls);
  const runsRemaining = match.target ? Math.max(0, match.target - currentInnings.totalRuns) : 0;
  const rrr =
    match.currentInningsIndex === 1 && ballsRemaining > 0 && match.target
      ? ((runsRemaining / ballsRemaining) * 6).toFixed(2)
      : null;

  // Filter deliveries of current over
  const currentOverNumber = Math.floor(currentInnings.legalBalls / 6);
  // Get recent deliveries up to 10
  const recentDeliveries = currentInnings.deliveries.slice(-8);

  const lastBall = currentInnings.deliveries[currentInnings.deliveries.length - 1];

  return (
    <>
      {/* Mobile Compact Single-Screen HUD (< md) */}
      <div className="md:hidden bg-[#0b1a2e] border border-[#1a365d] rounded-xl p-2.5 sm:p-3 shadow-xl space-y-2.5 shrink-0">
        {/* Row 1: Score & Situation */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2 sm:gap-2.5">
              <span className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider">
                {currentInnings.battingTeamName}
              </span>
              <span className="text-3xl font-black text-white font-mono-num leading-none tracking-tight">
                {currentInnings.totalRuns}/{currentInnings.totalWickets}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-400 font-mono-num">
                ({currentInnings.oversDisplay}/{match.totalOvers} ov)
              </span>
            </div>
            <div className="text-xs font-semibold text-amber-300 mt-0.5 truncate max-w-[210px] sm:max-w-xs">
              {match.status === 'completed'
                ? match.resultSummary
                : match.currentInningsIndex === 1 && match.target
                ? `Need ${runsRemaining} from ${ballsRemaining}b`
                : `Current Run Rate: ${crr}`}
            </div>
          </div>

          {/* Rates & Target chips */}
          <div className="flex flex-col items-end text-xs">
            <div className="flex items-center gap-1.5 font-mono-num font-bold">
              <span className="text-slate-400 text-[11px] font-semibold">CRR</span>
              <span className="text-white text-xs">{crr}</span>
              {rrr !== null && (
                <>
                  <span className="text-slate-600">·</span>
                  <span className="text-amber-400 text-[11px] font-semibold">RRR</span>
                  <span className="text-amber-400 text-xs">{rrr}</span>
                </>
              )}
            </div>
            {match.target && (
              <span className="text-[11px] text-slate-400 font-mono-num font-semibold mt-0.5">
                Target: <strong className="text-amber-300 text-xs">{match.target}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Batsmen & Bowler Crease HUD in 2 perfectly aligned cards */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 pt-1.5 border-t border-[#142c4c]">
          {/* Left Card: Batting */}
          <div className="bg-[#071322] border border-[#142c4c] rounded-xl p-2.5 sm:p-3 flex flex-col justify-between space-y-1.5 shadow-sm">
            {/* Tier 1 Header: Label + Innings / Striker info */}
            <div className="flex items-center justify-between pb-1 border-b border-[#142c4c]/70">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <span>🏏</span> Batting
              </span>
              <span className="font-mono-num text-[11px] font-semibold text-slate-400">
                SR {striker ? calculateStrikeRate(striker.runs, striker.balls) : '0.0'}
              </span>
            </div>

            {/* Tier 2: Striker (Active Batsman on Strike) */}
            <div className="flex items-center justify-between gap-1">
              <div className="flex items-center gap-1.5 font-bold text-white text-sm truncate max-w-[105px] sm:max-w-[130px]">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse ring-2 ring-amber-400/25" />
                <span className="truncate">{striker?.playerName?.split(' ')[0] || 'Striker'}*</span>
              </div>
              <div className="font-mono-num text-sm font-extrabold text-amber-300 text-right shrink-0">
                {striker?.runs ?? 0}
                <span className="text-xs font-normal text-slate-400 ml-1">({striker?.balls ?? 0}b)</span>
              </div>
            </div>

            {/* Tier 3: Non-Striker */}
            <div className="flex items-center justify-between gap-1 text-slate-300">
              <span className="truncate max-w-[105px] sm:max-w-[130px] pl-3.5 text-xs font-semibold text-slate-300">
                {nonStriker?.playerName?.split(' ')[0] || 'Non-Striker'}
              </span>
              <span className="font-mono-num text-xs font-bold text-slate-300 text-right shrink-0">
                {nonStriker?.runs ?? 0}
                <span className="text-[11px] font-normal text-slate-400 ml-1">({nonStriker?.balls ?? 0}b)</span>
              </span>
            </div>

            {/* Tier 4: Swap Strike Action Button */}
            <button
              onClick={onSwapStrike}
              title="Rotate Strike"
              className="w-full mt-1 py-1.5 px-2 text-xs font-bold text-slate-200 hover:text-amber-400 bg-[#0b1a2e] hover:bg-[#10253f] rounded-lg border border-[#142c4c] flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Rotate Strike</span>
            </button>
          </div>

          {/* Right Card: Bowling */}
          <div className="bg-[#071322] border border-[#142c4c] rounded-xl p-2.5 sm:p-3 flex flex-col justify-between space-y-1.5 shadow-sm">
            {/* Tier 1 Header: Label + Wickets/Runs Figures */}
            <div className="flex items-center justify-between pb-1 border-b border-[#142c4c]/70">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <span>⚾</span> Bowling
              </span>
              <span className="font-mono-num text-xs font-extrabold text-amber-400">
                {bowler?.wickets ?? 0}/{bowler?.runsConceded ?? 0}
              </span>
            </div>

            {/* Tier 2: Bowler Name */}
            <div className="flex items-center justify-between gap-1">
              <div className="font-bold text-white text-sm truncate max-w-[105px] sm:max-w-[130px]">
                {bowler?.playerName?.split(' ')[0] || 'Bowler'}
              </div>
              <div className="font-mono-num text-xs font-semibold text-slate-300 text-right shrink-0">
                {bowler?.overs ?? '0.0'} ov
              </div>
            </div>

            {/* Tier 3: Bowler Overs & Economy */}
            <div className="flex items-center justify-between gap-1 text-slate-300">
              <span className="text-xs font-medium text-slate-400">
                Economy
              </span>
              <span className="font-mono-num text-xs font-bold text-slate-200 text-right">
                {bowler ? calculateEconomy(bowler.runsConceded, bowler.legalBallsBowled) : '0.00'}
              </span>
            </div>

            {/* Tier 4: Change Bowler Action Button */}
            <button
              onClick={onChangeBowler}
              title="Change Bowler"
              className="w-full mt-1 py-1.5 px-2 text-xs font-bold text-slate-200 hover:text-blue-300 bg-[#0b1a2e] hover:bg-[#10253f] rounded-lg border border-[#142c4c] flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Change Bowler</span>
            </button>
          </div>
        </div>

        {/* Row 3: Recent deliveries & Partnership */}
        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-[#142c4c] text-xs">
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              This Over:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {recentDeliveries.slice(-6).map((del) => {
                let tokenBg = 'bg-[#10253f] text-slate-200 border-[#1a365d]';
                let label = del.strikerRuns.toString();
                if (del.isWicket) {
                  tokenBg = 'bg-rose-500/25 text-rose-300 border-rose-500 font-bold';
                  label = 'W';
                } else if (del.extraType === 'wide') {
                  tokenBg = 'bg-amber-400/20 text-amber-300 border-amber-400/50';
                  label = 'Wd';
                } else if (del.extraType === 'no-ball') {
                  tokenBg = 'bg-amber-400/20 text-amber-300 border-amber-400/50';
                  label = 'Nb';
                } else if (del.strikerRuns === 4) {
                  tokenBg = 'bg-blue-600/30 text-blue-300 border-blue-400 font-bold';
                  label = '4';
                } else if (del.strikerRuns === 6) {
                  tokenBg = 'bg-amber-400/30 text-amber-300 border-amber-400 font-black';
                  label = '6';
                } else if (del.strikerRuns === 0) {
                  tokenBg = 'bg-[#09182a] text-slate-500 border-[#142c4c]';
                  label = '•';
                }
                return (
                  <span
                    key={del.id}
                    className={`min-w-[24px] h-[22px] px-1 rounded-md flex items-center justify-center text-xs font-mono-num font-bold border ${tokenBg}`}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
          <span className="text-xs text-slate-300 font-mono-num font-semibold shrink-0">
            P'ship <strong className="text-amber-400">{currentInnings.currentPartnership.totalRuns}</strong> ({currentInnings.currentPartnership.balls}b)
          </span>
        </div>
      </div>

      {/* Desktop Spacious Live Scoreboard (md: and up) */}
      <div className="hidden md:block bg-[#0b1a2e] border border-[#1a365d] rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Match Context Bar */}
      <div className="bg-[#071322]/90 px-4 py-2.5 border-b border-[#142c4c] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">{match.name}</span>
          <span aria-hidden="true">·</span>
          <span>{match.venue}</span>
          <span aria-hidden="true">·</span>
          <span>{match.matchType} ({match.totalOvers} Overs)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-medium">Innings {currentInnings.inningsNumber} of 2</span>
          {match.status === 'completed' && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Match Concluded
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Score & Equation Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-[#0b1a2e] to-[#071322]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Score Block */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-6">
            <div>
              <div className="text-sm font-semibold tracking-wide text-amber-400/90 mb-1">
                {currentInnings.battingTeamName} batting
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-scoreboard text-6xl sm:text-7xl font-extrabold text-white tracking-tight font-mono-num leading-none">
                  {currentInnings.totalRuns}/{currentInnings.totalWickets}
                </span>
                <span className="text-2xl sm:text-3xl font-scoreboard text-slate-400 font-mono-num">
                  ({currentInnings.oversDisplay} / {match.totalOvers} ov)
                </span>
              </div>
            </div>

            {/* Run Rates Box */}
            <div className="flex sm:flex-col gap-4 sm:gap-1 text-sm border-t sm:border-t-0 sm:border-l border-[#1a365d] pt-2 sm:pt-0 sm:pl-6">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs">CRR</span>
                <span className="font-mono-num font-semibold text-white">{crr}</span>
              </div>
              {rrr !== null && (
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-xs font-medium">RRR</span>
                  <span className="font-mono-num font-bold text-amber-400">{rrr}</span>
                </div>
              )}
              {match.currentInningsIndex === 1 && match.target && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Target</span>
                  <span className="font-mono-num font-semibold text-amber-300">{match.target}</span>
                </div>
              )}
            </div>
          </div>

          {/* Situation Equation */}
          <div className="lg:col-span-5 bg-[#071322]/80 border border-[#142c4c] rounded-xl p-3.5 shadow-inner">
            <div className="text-xs text-slate-400 mb-1 font-medium">Match Situation</div>
            <div className="text-sm sm:text-base font-semibold text-amber-300">
              {match.status === 'completed'
                ? match.resultSummary
                : match.currentInningsIndex === 1 && match.target
                ? `${currentInnings.battingTeamName} need ${runsRemaining} run${runsRemaining !== 1 ? 's' : ''} from ${ballsRemaining} ball${ballsRemaining !== 1 ? 's' : ''}`
                : `${currentInnings.battingTeamName} are currently at ${currentInnings.totalRuns}/${currentInnings.totalWickets} in ${currentInnings.oversDisplay} overs`}
            </div>
            {/* Innings 1 Comparison if available */}
            {match.currentInningsIndex === 1 && (
              <div className="mt-1 text-xs text-slate-400">
                1st Innings: {match.innings[0].battingTeamName} scored {match.innings[0].totalRuns}/{match.innings[0].totalWickets} ({match.innings[0].oversDisplay} ov)
              </div>
            )}
          </div>
        </div>

        {/* Current Over Balls Strip */}
        <div className="mt-6 pt-4 border-t border-[#142c4c] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 whitespace-nowrap">Recent Balls:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {recentDeliveries.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No balls yet in this innings</span>
              ) : (
                recentDeliveries.map((del) => {
                  let tokenBg = 'bg-[#10253f] text-slate-100 border-[#1a365d]';
                  let label = del.strikerRuns.toString();

                  if (del.isWicket) {
                    tokenBg = 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-bold';
                    label = 'W';
                  } else if (del.extraType === 'wide') {
                    tokenBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                    label = `Wd${del.extraRuns > 1 ? `+${del.extraRuns - 1}` : ''}`;
                  } else if (del.extraType === 'no-ball') {
                    tokenBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                    label = `Nb${del.strikerRuns > 0 ? `+${del.strikerRuns}` : ''}`;
                  } else if (del.strikerRuns === 4) {
                    tokenBg = 'bg-blue-600/25 text-blue-300 border-blue-500/60 font-bold';
                    label = '4';
                  } else if (del.strikerRuns === 6) {
                    tokenBg = 'bg-amber-400/25 text-amber-300 border-amber-400/60 font-black';
                    label = '6';
                  } else if (del.strikerRuns === 0) {
                    tokenBg = 'bg-[#09182a] text-slate-500 border-[#142c4c]';
                    label = '•';
                  }

                  return (
                    <div
                      key={del.id}
                      title={`${del.scoreAtEnd.oversDisplay}: ${del.commentary}`}
                      className={`min-w-[28px] h-7 px-1.5 rounded-md flex items-center justify-center text-xs font-mono-num border ${tokenBg}`}
                    >
                      {label}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Partnership snippet */}
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span>Current Partnership:</span>
            <span className="font-mono-num font-semibold text-slate-200">
              {currentInnings.currentPartnership.totalRuns} runs ({currentInnings.currentPartnership.balls} balls)
            </span>
          </div>
        </div>

        {/* Live Commentary One-Liner */}
        {lastBall && (
          <div className="mt-3 px-3 py-2 bg-[#071322]/80 border border-[#142c4c] rounded-lg text-xs text-slate-300 flex items-start gap-2">
            <span className="text-amber-400 font-mono-num font-semibold shrink-0">
              {lastBall.scoreAtEnd.oversDisplay}
            </span>
            <p className="line-clamp-2">{lastBall.commentary}</p>
          </div>
        )}
      </div>

      {/* Crease / Active Players Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#142c4c] divide-y md:divide-y-0 md:divide-x divide-[#142c4c] bg-[#071322]/50">
        {/* Striker Batsman */}
        <div className="p-4 relative group">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                STRIKER
              </span>
            </div>
            <button
              onClick={onSwapStrike}
              className="text-[11px] text-slate-400 hover:text-amber-400 hover:bg-[#10253f] px-2 py-0.5 rounded transition-colors"
              title="Manually switch strike with non-striker"
            >
              Swap Strike ⇄
            </button>
          </div>

          <div className="text-base font-bold text-white truncate">
            {striker?.playerName || 'Striker'} *
          </div>

          <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs bg-[#0b1a2e]/80 p-2 rounded-lg border border-[#142c4c]">
            <div>
              <div className="text-slate-400 text-[10px]">RUNS</div>
              <div className="font-scoreboard text-xl font-bold text-white font-mono-num">
                {striker?.runs ?? 0}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">BALLS</div>
              <div className="font-mono-num font-semibold text-slate-300 mt-1">
                {striker?.balls ?? 0}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">4s / 6s</div>
              <div className="font-mono-num font-semibold text-slate-300 mt-1">
                {striker?.fours ?? 0}/{striker?.sixes ?? 0}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">SR</div>
              <div className="font-mono-num font-semibold text-amber-400 mt-1">
                {striker ? calculateStrikeRate(striker.runs, striker.balls) : 0}
              </div>
            </div>
          </div>
        </div>

        {/* Non-Striker Batsman */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">NON-STRIKER</span>
          </div>

          <div className="text-base font-bold text-slate-200 truncate">
            {nonStriker?.playerName || 'Non-Striker'}
          </div>

          <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs bg-[#0b1a2e]/80 p-2 rounded-lg border border-[#142c4c]">
            <div>
              <div className="text-slate-400 text-[10px]">RUNS</div>
              <div className="font-scoreboard text-xl font-bold text-white font-mono-num">
                {nonStriker?.runs ?? 0}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">BALLS</div>
              <div className="font-mono-num font-semibold text-slate-300 mt-1">
                {nonStriker?.balls ?? 0}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">4s / 6s</div>
              <div className="font-mono-num font-semibold text-slate-300 mt-1">
                {nonStriker?.fours ?? 0}/{nonStriker?.sixes ?? 0}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">SR</div>
              <div className="font-mono-num font-semibold text-slate-300 mt-1">
                {nonStriker ? calculateStrikeRate(nonStriker.runs, nonStriker.balls) : 0}
              </div>
            </div>
          </div>
        </div>

        {/* Current Bowler */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-400">ACTIVE BOWLER</span>
            <button
              onClick={onChangeBowler}
              className="text-[11px] text-slate-400 hover:text-blue-300 hover:bg-[#10253f] px-2 py-0.5 rounded transition-colors"
              title="Change Bowler"
            >
              Change Bowler ↷
            </button>
          </div>

          <div className="text-base font-bold text-white truncate">
            {bowler?.playerName || 'Bowler'}
          </div>

          <div className="mt-2 grid grid-cols-5 gap-1 text-center text-xs bg-[#0b1a2e]/80 p-2 rounded-lg border border-[#142c4c]">
            <div>
              <div className="text-slate-400 text-[10px]">OVERS</div>
              <div className="font-mono-num font-semibold text-slate-200 mt-1">
                {bowler?.overs ?? '0.0'}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">MAIDEN</div>
              <div className="font-mono-num font-semibold text-slate-200 mt-1">
                {bowler?.maidens ?? 0}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">RUNS</div>
              <div className="font-scoreboard text-xl font-bold text-white font-mono-num">
                {bowler?.runsConceded ?? 0}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">WKT</div>
              <div className="font-scoreboard text-xl font-bold text-amber-400 font-mono-num">
                {bowler?.wickets ?? 0}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">ECON</div>
              <div className="font-mono-num font-semibold text-amber-300 mt-1">
                {bowler ? calculateEconomy(bowler.runsConceded, bowler.legalBallsBowled) : 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};
