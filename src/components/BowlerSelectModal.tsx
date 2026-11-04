import React from 'react';
import { Match } from '../types/cricket';
import { X, AlertCircle } from 'lucide-react';

interface BowlerSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  onSelectBowler: (bowlerId: string) => void;
}

export const BowlerSelectModal: React.FC<BowlerSelectModalProps> = ({
  isOpen,
  onClose,
  match,
  onSelectBowler,
}) => {
  if (!isOpen) return null;

  const currentInnings = match.innings[match.currentInningsIndex];
  const bowlingTeam = match.team1.id === currentInnings.bowlingTeamId ? match.team1 : match.team2;
  const previousBowlerId = currentInnings.previousBowlerId;
  const currentBowlerId = currentInnings.currentBowlerId;

  // Max overs per bowler in limited overs matches (e.g. 4 for T20, 10 for ODI)
  const maxOversPerBowler = Math.ceil(match.totalOvers / 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0b1a2e] border border-[#142c4c] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-[#142c4c] flex items-center justify-between bg-[#071322]">
          <div>
            <h3 className="text-base font-bold text-white">Select Next Bowler</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Choose who bowls from {bowlingTeam.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#10253f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
          {bowlingTeam.players.map((player) => {
            const stats = currentInnings.bowlersStats[player.id];
            const isPreviousBowler = player.id === previousBowlerId;
            const isCurrentBowler = player.id === currentBowlerId;
            const oversBowled = stats ? parseFloat(stats.overs) : 0;
            const isOversExhausted = oversBowled >= maxOversPerBowler;

            return (
              <button
                key={player.id}
                onClick={() => {
                  if (!isPreviousBowler) {
                    onSelectBowler(player.id);
                    onClose();
                  }
                }}
                disabled={isPreviousBowler}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between min-h-[52px] ${
                  isPreviousBowler
                    ? 'opacity-40 bg-[#071322] border-[#142c4c] cursor-not-allowed'
                    : isCurrentBowler
                    ? 'bg-amber-400/15 border-amber-400/50 text-white shadow-sm'
                    : 'bg-[#071322]/80 border-[#142c4c] hover:border-amber-400/40 hover:bg-[#10253f] text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{player.name}</span>
                    {isCurrentBowler && (
                      <span className="text-[10px] text-amber-400 font-bold">Currently Bowling</span>
                    )}
                    {isPreviousBowler && (
                      <span className="text-[10px] text-rose-400 font-medium">Bowled Last Over</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {player.role} · {player.bowlingStyle || 'Bowler'}
                  </div>
                </div>

                <div className="text-right text-xs">
                  {stats ? (
                    <>
                      <div className="font-mono-num font-bold text-amber-400">
                        {stats.wickets}/{stats.runsConceded}
                      </div>
                      <div className="font-mono-num text-[11px] text-slate-400">
                        {stats.overs} ov · Econ {stats.economy}
                      </div>
                    </>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">Yet to bowl</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-[#071322] border-t border-[#142c4c] text-xs text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            Max {maxOversPerBowler} overs per bowler in this match
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white rounded-lg hover:bg-[#10253f] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
