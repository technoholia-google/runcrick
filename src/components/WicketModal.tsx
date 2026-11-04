import React, { useState } from 'react';
import { Match, DismissalType } from '../types/cricket';
import { X } from 'lucide-react';

interface WicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  onConfirmWicket: (params: {
    wicketType: DismissalType;
    outBatsmanId: string;
    fielderId?: string;
    fielderName?: string;
    nextBatsmanId?: string;
    strikerRuns: number;
  }) => void;
}

const dismissalTypes: { type: DismissalType; label: string; requiresFielder: boolean }[] = [
  { type: 'bowled', label: 'Bowled', requiresFielder: false },
  { type: 'caught', label: 'Caught', requiresFielder: true },
  { type: 'lbw', label: 'LBW', requiresFielder: false },
  { type: 'run-out', label: 'Run Out', requiresFielder: true },
  { type: 'stumped', label: 'Stumped', requiresFielder: true },
  { type: 'caught-bowled', label: 'Caught & Bowled', requiresFielder: false },
  { type: 'hit-wicket', label: 'Hit Wicket', requiresFielder: false },
  { type: 'retired-hurt', label: 'Retired Hurt', requiresFielder: false },
];

export const WicketModal: React.FC<WicketModalProps> = ({
  isOpen,
  onClose,
  match,
  onConfirmWicket,
}) => {
  const currentInnings = match.innings[match.currentInningsIndex];
  const striker = currentInnings.batsmenStats[currentInnings.currentStrikerId];
  const nonStriker = currentInnings.batsmenStats[currentInnings.currentNonStrikerId];

  const battingTeam = match.team1.id === currentInnings.battingTeamId ? match.team1 : match.team2;
  const bowlingTeam = match.team1.id === currentInnings.bowlingTeamId ? match.team1 : match.team2;

  // Batsmen who haven't batted yet
  const availableBatsmen = battingTeam.players.filter((p) => {
    const stats = currentInnings.batsmenStats[p.id];
    return !stats || (!stats.isBatting && !stats.isOut);
  });

  const [wicketType, setWicketType] = useState<DismissalType>('caught');
  const [outBatsmanId, setOutBatsmanId] = useState<string>(striker?.playerId || '');
  const [fielderId, setFielderId] = useState<string>(bowlingTeam.players[0]?.id || '');
  const [nextBatsmanId, setNextBatsmanId] = useState<string>(availableBatsmen[0]?.id || '');
  const [runsCompleted, setRunsCompleted] = useState<number>(0);

  if (!isOpen) return null;

  const selectedTypeObj = dismissalTypes.find((d) => d.type === wicketType);
  const selectedFielder = bowlingTeam.players.find((p) => p.id === fielderId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmWicket({
      wicketType,
      outBatsmanId: outBatsmanId || striker.playerId,
      fielderId: selectedTypeObj?.requiresFielder ? fielderId : undefined,
      fielderName: selectedTypeObj?.requiresFielder ? selectedFielder?.name : undefined,
      nextBatsmanId: nextBatsmanId || undefined,
      strikerRuns: runsCompleted,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0b1a2e] border border-[#142c4c] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#142c4c] flex items-center justify-between bg-[#071322]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-base font-bold text-white">Record Wicket Dismissal</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#10253f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Dismissal Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Dismissal Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {dismissalTypes.map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setWicketType(item.type)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-colors min-h-[44px] flex items-center justify-center ${
                    wicketType === item.type
                      ? 'bg-rose-500/25 border-rose-500 text-rose-300 font-bold shadow-sm'
                      : 'bg-[#071322]/80 border-[#142c4c] text-slate-300 hover:bg-[#10253f] hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Out Batsman Selector (Crucial for Run Out) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Batsman Dismissed
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOutBatsmanId(striker?.playerId || '')}
                className={`p-3 rounded-xl border text-left min-h-[44px] transition-colors ${
                  outBatsmanId === striker?.playerId
                    ? 'bg-rose-500/15 border-rose-500 text-white shadow-sm'
                    : 'bg-[#071322]/80 border-[#142c4c] text-slate-400 hover:bg-[#10253f] hover:text-slate-200'
                }`}
              >
                <div className="text-xs text-rose-400 font-semibold">Striker</div>
                <div className="font-bold text-sm text-slate-100">{striker?.playerName}</div>
                <div className="text-[11px] text-slate-400 font-mono-num">{striker?.runs} ({striker?.balls}b)</div>
              </button>

              <button
                type="button"
                onClick={() => setOutBatsmanId(nonStriker?.playerId || '')}
                className={`p-3 rounded-xl border text-left min-h-[44px] transition-colors ${
                  outBatsmanId === nonStriker?.playerId
                    ? 'bg-rose-500/15 border-rose-500 text-white shadow-sm'
                    : 'bg-[#071322]/80 border-[#142c4c] text-slate-400 hover:bg-[#10253f] hover:text-slate-200'
                }`}
              >
                <div className="text-xs text-slate-400 font-semibold">Non-Striker</div>
                <div className="font-bold text-sm text-slate-100">{nonStriker?.playerName}</div>
                <div className="text-[11px] text-slate-400 font-mono-num">{nonStriker?.runs} ({nonStriker?.balls}b)</div>
              </button>
            </div>
          </div>

          {/* Fielder Selector (if caught, run out, stumped) */}
          {selectedTypeObj?.requiresFielder && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Fielder Involved
              </label>
              <select
                value={fielderId}
                onChange={(e) => setFielderId(e.target.value)}
                className="w-full bg-[#071322] border border-[#142c4c] rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-400"
              >
                {bowlingTeam.players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Runs scored on delivery before wicket */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Runs Completed on Delivery (e.g. 1 on Run Out)
            </label>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRunsCompleted(r)}
                  className={`w-12 h-10 rounded-xl border text-sm font-semibold font-mono-num transition-colors ${
                    runsCompleted === r
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
                      : 'bg-[#071322] border-[#142c4c] text-slate-300 hover:bg-[#10253f]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Next Batsman Selector */}
          {availableBatsmen.length > 0 ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Incoming Batsman
              </label>
              <select
                value={nextBatsmanId}
                onChange={(e) => setNextBatsmanId(e.target.value)}
                className="w-full bg-[#071322] border border-[#142c4c] rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-400"
              >
                {availableBatsmen.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.role})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-xs text-amber-300 bg-amber-400/10 p-2.5 rounded-xl border border-amber-400/30">
              No further batsmen available. Innings will conclude (All Out / 10 wickets).
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#142c4c]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg hover:bg-[#10253f] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md transition-colors"
            >
              Confirm Wicket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
