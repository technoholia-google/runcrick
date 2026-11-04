import React, { useState } from 'react';
import { Match, ExtraType } from '../types/cricket';
import { Undo2, RefreshCw, UserCheck, Flame, ArrowRightLeft } from 'lucide-react';

interface ScoringKeypadProps {
  match: Match;
  onRecordBall: (params: {
    strikerRuns: number;
    extraType?: ExtraType;
    extraRuns?: number;
    isWicket?: boolean;
  }) => void;
  onOpenWicketModal: () => void;
  onOpenBowlerModal: () => void;
  onSwapStrike: () => void;
  onUndoBall: () => void;
  onStartSecondInnings: () => void;
  canUndo: boolean;
}

export const ScoringKeypad: React.FC<ScoringKeypadProps> = ({
  match,
  onRecordBall,
  onOpenWicketModal,
  onOpenBowlerModal,
  onSwapStrike,
  onUndoBall,
  onStartSecondInnings,
  canUndo,
}) => {
  const [selectedExtra, setSelectedExtra] = useState<ExtraType | null>(null);
  const currentInnings = match.innings[match.currentInningsIndex];
  const isMatchOver = match.status === 'completed';
  const isInningsOver = currentInnings.isCompleted;

  const handleRunClick = (runs: number) => {
    if (isMatchOver) return;

    if (selectedExtra) {
      if (selectedExtra === 'wide') {
        // Wide + runs (e.g. wide + 1 bye = 2 extra runs total)
        onRecordBall({
          strikerRuns: 0,
          extraType: 'wide',
          extraRuns: 1 + runs,
        });
      } else if (selectedExtra === 'no-ball') {
        // No-ball gives 1 penalty + runs credited to batsman
        onRecordBall({
          strikerRuns: runs,
          extraType: 'no-ball',
          extraRuns: 1,
        });
      } else if (selectedExtra === 'bye' || selectedExtra === 'leg-bye') {
        onRecordBall({
          strikerRuns: 0,
          extraType: selectedExtra,
          extraRuns: runs === 0 ? 1 : runs,
        });
      }
      setSelectedExtra(null);
    } else {
      // Normal delivery
      onRecordBall({
        strikerRuns: runs,
      });
    }
  };

  return (
    <div className="bg-[#0b1a2e] border border-[#1a365d] rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-2xl shrink-0">
      {/* Header of scoring console */}
      <div className="flex items-center justify-between mb-2 sm:mb-4 pb-1.5 sm:pb-3 border-b border-[#142c4c]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400" />
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            Match Scoring Console
          </h2>
        </div>

        {/* Quick Utility Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onSwapStrike}
            disabled={isMatchOver}
            title="Swap Striker and Non-Striker"
            className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium bg-[#10253f] hover:bg-[#163357] text-slate-200 border border-[#1a365d] transition-colors disabled:opacity-40"
          >
            <ArrowRightLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Rotate Strike</span>
          </button>

          <button
            onClick={onOpenBowlerModal}
            disabled={isMatchOver}
            title="Change Bowler"
            className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium bg-[#10253f] hover:bg-[#163357] text-slate-200 border border-[#1a365d] transition-colors disabled:opacity-40"
          >
            <UserCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Change Bowler</span>
          </button>

          <button
            onClick={onUndoBall}
            disabled={!canUndo || isMatchOver}
            title="Undo Last Ball"
            className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors disabled:opacity-30 disabled:border-[#142c4c] disabled:text-slate-600"
          >
            <Undo2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Undo</span>
          </button>
        </div>
      </div>

      {/* If match is completed or 1st innings is done */}
      {isMatchOver ? (
        <div className="p-4 sm:p-6 text-center bg-[#071322] border border-[#1a365d] rounded-xl mb-2 sm:mb-4">
          <div className="text-xl sm:text-2xl font-bold text-amber-400 mb-1">Match Concluded</div>
          <p className="text-xs sm:text-sm text-slate-300">{match.resultSummary}</p>
          <div className="mt-2 sm:mt-4 flex items-center justify-center gap-3">
            <span className="text-[11px] sm:text-xs text-slate-400">
              Check the Full Scorecard and Stats tabs for detailed match breakdowns.
            </span>
          </div>
        </div>
      ) : isInningsOver && match.currentInningsIndex === 0 ? (
        <div className="p-4 sm:p-6 text-center bg-[#071322] border border-[#1a365d] rounded-xl mb-2 sm:mb-4">
          <div className="text-base sm:text-lg font-bold text-amber-400 mb-1">Innings 1 Completed!</div>
          <p className="text-xs sm:text-sm text-slate-300 mb-3 sm:mb-4">
            {currentInnings.battingTeamName} finished on {currentInnings.totalRuns}/{currentInnings.totalWickets} ({currentInnings.oversDisplay} ov).
            Target for {match.innings[1].battingTeamName}: {match.target} runs.
          </p>
          <button
            onClick={onStartSecondInnings}
            className="px-5 py-2.5 sm:px-6 sm:py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-amber-400/20 active:scale-95"
          >
            Start 2nd Innings Run Chase →
          </button>
        </div>
      ) : null}

      {/* Extras Selection Strip */}
      {!isMatchOver && !isInningsOver && (
        <div className="mb-2 sm:mb-4">
          <div className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 sm:mb-2 flex items-center justify-between">
            <span>Extras (Optional):</span>
            {selectedExtra && (
              <button
                onClick={() => setSelectedExtra(null)}
                className="text-[10px] sm:text-[11px] text-rose-400 hover:underline font-bold"
              >
                Clear [{selectedExtra.toUpperCase()}] ✕
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedExtra(selectedExtra === 'wide' ? null : 'wide')}
              className={`h-9.5 sm:h-11 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border transition-colors flex items-center justify-center active:scale-95 ${
                selectedExtra === 'wide'
                  ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-sm'
                  : 'bg-[#071322] border-[#142c4c] text-slate-300 hover:bg-[#10253f]'
              }`}
            >
              WD (Wide)
            </button>
            <button
              onClick={() => setSelectedExtra(selectedExtra === 'no-ball' ? null : 'no-ball')}
              className={`h-9.5 sm:h-11 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border transition-colors flex items-center justify-center active:scale-95 ${
                selectedExtra === 'no-ball'
                  ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-sm'
                  : 'bg-[#071322] border-[#142c4c] text-slate-300 hover:bg-[#10253f]'
              }`}
            >
              NB (No Ball)
            </button>
            <button
              onClick={() => setSelectedExtra(selectedExtra === 'bye' ? null : 'bye')}
              className={`h-9.5 sm:h-11 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border transition-colors flex items-center justify-center active:scale-95 ${
                selectedExtra === 'bye'
                  ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-sm'
                  : 'bg-[#071322] border-[#142c4c] text-slate-300 hover:bg-[#10253f]'
              }`}
            >
              B (Bye)
            </button>
            <button
              onClick={() => setSelectedExtra(selectedExtra === 'leg-bye' ? null : 'leg-bye')}
              className={`h-9.5 sm:h-11 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border transition-colors flex items-center justify-center active:scale-95 ${
                selectedExtra === 'leg-bye'
                  ? 'bg-amber-400 border-amber-300 text-slate-950 shadow-sm'
                  : 'bg-[#071322] border-[#142c4c] text-slate-300 hover:bg-[#10253f]'
              }`}
            >
              LB (Leg Bye)
            </button>
            <button
              onClick={() => {
                onRecordBall({ strikerRuns: 0, extraType: 'penalty', extraRuns: 5 });
                setSelectedExtra(null);
              }}
              className="hidden sm:flex h-11 rounded-xl text-xs sm:text-sm font-bold border border-[#142c4c] bg-[#071322] text-slate-300 hover:bg-[#10253f] items-center justify-center transition-colors active:scale-95"
            >
              +5 Pen
            </button>
          </div>
        </div>
      )}

      {/* Main Runs Keypad & Wicket */}
      {!isMatchOver && !isInningsOver && (
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2.5">
          {/* 0 (Dot ball) */}
          <button
            onClick={() => handleRunClick(0)}
            className="h-13 sm:h-16 rounded-lg sm:rounded-xl bg-[#10253f] hover:bg-[#163357] active:scale-95 border border-[#1a365d] flex flex-col items-center justify-center transition-all group"
          >
            <span className="font-scoreboard text-2xl sm:text-3xl font-extrabold text-slate-300 font-mono-num group-hover:text-white leading-none">
              0
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-wider mt-0.5">DOT</span>
          </button>

          {/* 1 Run */}
          <button
            onClick={() => handleRunClick(1)}
            className="h-13 sm:h-16 rounded-lg sm:rounded-xl bg-[#10253f] hover:bg-[#163357] active:scale-95 border border-[#1a365d] flex flex-col items-center justify-center transition-all group"
          >
            <span className="font-scoreboard text-2xl sm:text-3xl font-extrabold text-white font-mono-num leading-none">
              1
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-wider mt-0.5">SINGLE</span>
          </button>

          {/* 2 Runs */}
          <button
            onClick={() => handleRunClick(2)}
            className="h-13 sm:h-16 rounded-lg sm:rounded-xl bg-[#10253f] hover:bg-[#163357] active:scale-95 border border-[#1a365d] flex flex-col items-center justify-center transition-all group"
          >
            <span className="font-scoreboard text-2xl sm:text-3xl font-extrabold text-white font-mono-num leading-none">
              2
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-wider mt-0.5">DOUBLE</span>
          </button>

          {/* 3 Runs */}
          <button
            onClick={() => handleRunClick(3)}
            className="h-13 sm:h-16 rounded-lg sm:rounded-xl bg-[#10253f] hover:bg-[#163357] active:scale-95 border border-[#1a365d] flex flex-col items-center justify-center transition-all group"
          >
            <span className="font-scoreboard text-2xl sm:text-3xl font-extrabold text-white font-mono-num leading-none">
              3
            </span>
            <span className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-wider mt-0.5">THREE</span>
          </button>

          {/* 4 (Boundary) - Sri Lanka Royal Blue */}
          <button
            onClick={() => handleRunClick(4)}
            className="h-13 sm:h-16 rounded-lg sm:rounded-xl bg-blue-600/25 hover:bg-blue-600/35 active:scale-95 border border-blue-500/60 flex flex-col items-center justify-center transition-all text-blue-300"
          >
            <span className="font-scoreboard text-2xl sm:text-3xl font-black font-mono-num leading-none">
              4
            </span>
            <span className="text-[10px] sm:text-xs font-black tracking-wider mt-0.5">FOUR</span>
          </button>

          {/* 6 (Maximum) - Sri Lanka Lion Gold */}
          <button
            onClick={() => handleRunClick(6)}
            className="h-13 sm:h-16 rounded-lg sm:rounded-xl bg-amber-400/25 hover:bg-amber-400/35 active:scale-95 border border-amber-400/70 flex flex-col items-center justify-center transition-all text-amber-300"
          >
            <span className="font-scoreboard text-2xl sm:text-3xl font-black font-mono-num leading-none">
              6
            </span>
            <span className="text-[10px] sm:text-xs font-black tracking-wider mt-0.5">SIX</span>
          </button>

          {/* WICKET BUTTON */}
          <button
            onClick={onOpenWicketModal}
            className="col-span-2 sm:col-span-1 h-13 sm:h-16 rounded-lg sm:rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 border border-rose-500 text-white flex flex-col items-center justify-center transition-all shadow-lg shadow-rose-600/25"
          >
            <span className="font-scoreboard text-xl sm:text-2xl font-black tracking-wider leading-none">
              OUT
            </span>
            <span className="text-[10px] sm:text-xs font-black tracking-wider mt-0.5">WICKET</span>
          </button>
        </div>
      )}
    </div>
  );
};
