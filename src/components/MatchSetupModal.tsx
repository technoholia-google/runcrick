import React, { useState } from 'react';
import { Match } from '../types/cricket';
import { createNewMatch } from '../data/presetMatches';
import { X, Plus, Minus, Palette, Check } from 'lucide-react';
import { ThemeId, THEME_OPTIONS } from '../theme/colors';

interface MatchSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMatch: (newMatch: Match) => void;
  currentTheme?: ThemeId;
  onSelectTheme?: (theme: ThemeId) => void;
}

export const MatchSetupModal: React.FC<MatchSetupModalProps> = ({
  isOpen,
  onClose,
  onStartMatch,
  currentTheme = 'bright_sunny',
  onSelectTheme,
}) => {
  const [matchName, setMatchName] = useState('SSL Premier League');
  const [venue, setVenue] = useState('Galungara Park');
  const [matchType, setMatchType] = useState<'T20' | 'ODI' | 'Custom'>('T20');
  const [oversInput, setOversInput] = useState<string>('20');

  const [team1Name, setTeam1Name] = useState('Sydney Sharks');
  const [team1Short, setTeam1Short] = useState('SHK');
  const [team1Color, setTeam1Color] = useState('#0284c7');
  const [team1PlayersText, setTeam1PlayersText] = useState(
    'David Warner\nSteve Smith\nMitchell Marsh\nGlenn Maxwell\nMarcus Stoinis\nMatthew Wade\nPat Cummins\nMitchell Starc\nSean Abbott\nAdam Zampa\nJosh Hazlewood'
  );

  const [team2Name, setTeam2Name] = useState('Lankan Lions');
  const [team2Short, setTeam2Short] = useState('LIO');
  const [team2Color, setTeam2Color] = useState('#eab308');
  const [team2PlayersText, setTeam2PlayersText] = useState(
    'Pathum Nissanka\nKusal Mendis\nCharith Asalanka\nSadeera Samarawickrama\nBhanuka Rajapaksa\nWanindu Hasaranga\nDasun Shanaka\nChamika Karunaratne\nMaheesh Theekshana\nMatheesha Pathirana\nDilshan Madushanka'
  );

  const [tossWinner, setTossWinner] = useState<1 | 2>(1);
  const [tossDecision, setTossDecision] = useState<'bat' | 'bowl'>('bat');

  if (!isOpen) return null;

  const handleFormatChange = (format: 'T20' | 'ODI' | 'Custom') => {
    setMatchType(format);
    if (format === 'T20') setOversInput('20');
    else if (format === 'ODI') setOversInput('50');
    else {
      // Default to 4 overs when switching to Custom if it was 20 or 50
      if (oversInput === '20' || oversInput === '50') {
        setOversInput('4');
      }
    }
  };

  const handleOversInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow empty string so mobile users can backspace/delete digits freely!
    if (val === '' || /^\d+$/.test(val)) {
      if (val.length <= 3) {
        setOversInput(val);
      }
    }
  };

  const handleOversInputBlur = () => {
    if (oversInput === '' || parseInt(oversInput, 10) < 1) {
      setOversInput('1');
    } else if (parseInt(oversInput, 10) > 100) {
      setOversInput('100');
    }
  };

  const handleDecrementOvers = () => {
    const current = parseInt(oversInput, 10) || 1;
    const next = Math.max(1, current - 1);
    setOversInput(next.toString());
  };

  const handleIncrementOvers = () => {
    const current = parseInt(oversInput, 10) || 0;
    const next = Math.min(100, current + 1);
    setOversInput(next.toString());
  };

  const handleSelectPresetOvers = (overs: number) => {
    setOversInput(overs.toString());
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const t1Players = team1PlayersText.split('\n').filter((p) => p.trim().length > 0);
    const t2Players = team2PlayersText.split('\n').filter((p) => p.trim().length > 0);

    const parsedOvers = Math.max(1, Math.min(100, parseInt(oversInput, 10) || 4));

    const match = createNewMatch({
      name: matchName,
      venue,
      matchType,
      totalOvers: parsedOvers,
      team1Name,
      team1Short,
      team1Color,
      team1Players: t1Players,
      team2Name,
      team2Short,
      team2Color,
      team2Players: t2Players,
      tossWinner,
      tossDecision,
    });
    onStartMatch(match);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0b1a2e] border border-[#142c4c] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-[#071322] px-6 py-4 border-b border-[#142c4c] flex items-center justify-between z-10">
          <div>
            <h3 className="text-base font-bold text-white">Match Setup</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure teams, match format, and overs to start scoring
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#10253f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Match Configuration Form */}
          <form onSubmit={handleCreateCustom} className="space-y-4">
            {/* Match Name & Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Match Title
                </label>
                <input
                  type="text"
                  value={matchName}
                  onChange={(e) => setMatchName(e.target.value)}
                  className="w-full bg-[#071322] border border-[#142c4c] rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Venue
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full bg-[#071322] border border-[#142c4c] rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Format & Overs */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Match Format & Overs
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['T20', 'ODI', 'Custom'] as const).map((fmt) => (
                  <button
                    type="button"
                    key={fmt}
                    onClick={() => handleFormatChange(fmt)}
                    className={`py-2 text-xs font-semibold rounded-xl border text-center transition-all min-h-[40px] ${
                      matchType === fmt
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold shadow-sm'
                        : 'bg-[#071322] border-[#142c4c] text-slate-400 hover:bg-[#10253f] hover:text-white'
                    }`}
                  >
                    {fmt === 'T20' ? 'T20 (20 ov)' : fmt === 'ODI' ? 'ODI (50 ov)' : 'Custom Overs'}
                  </button>
                ))}
              </div>

              {matchType === 'Custom' && (
                <div className="mt-3 bg-[#071322] p-4 rounded-xl border border-[#142c4c] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label htmlFor="custom-overs-input" className="block text-xs font-semibold text-slate-200">
                        Overs per Innings
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Type any number (e.g. 4) or tap +/-
                      </span>
                    </div>

                    {/* Stepper + Input with 44px+ mobile touch hitboxes */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={handleDecrementOvers}
                        aria-label="Decrease overs"
                        className="w-11 h-11 rounded-xl bg-[#0b1a2e] border border-[#142c4c] hover:bg-[#10253f] active:scale-95 text-slate-200 flex items-center justify-center transition-all min-h-[44px] min-w-[44px]"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <input
                        id="custom-overs-input"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={oversInput}
                        onChange={handleOversInputChange}
                        onBlur={handleOversInputBlur}
                        placeholder="e.g. 4"
                        className="w-20 sm:w-24 h-11 bg-[#0b1a2e] border border-[#142c4c] rounded-xl px-2 text-center text-lg font-bold font-mono-num text-amber-300 focus:outline-none focus:border-amber-400 min-h-[44px]"
                      />

                      <button
                        type="button"
                        onClick={handleIncrementOvers}
                        aria-label="Increase overs"
                        className="w-11 h-11 rounded-xl bg-[#0b1a2e] border border-[#142c4c] hover:bg-[#10253f] active:scale-95 text-slate-200 flex items-center justify-center transition-all min-h-[44px] min-w-[44px]"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Touch Chips for Mobile (including 4 overs!) */}
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">
                      Quick Select Overs
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[2, 3, 4, 5, 6, 8, 10, 12, 15].map((ov) => (
                        <button
                          type="button"
                          key={ov}
                          onClick={() => handleSelectPresetOvers(ov)}
                          className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all min-h-[40px] ${
                            oversInput === ov.toString()
                              ? 'bg-amber-400/25 border-amber-400 text-amber-300 font-bold'
                              : 'bg-[#0b1a2e] border-[#142c4c] text-slate-400 hover:text-white hover:bg-[#10253f]'
                          }`}
                        >
                          {ov} ov
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Teams Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Team 1 */}
              <div className="bg-[#071322] p-4 rounded-xl border border-[#142c4c] space-y-3">
                <div className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  Team 1 Details
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Team Name</label>
                  <input
                    type="text"
                    value={team1Name}
                    onChange={(e) => setTeam1Name(e.target.value)}
                    className="w-full bg-[#0b1a2e] border border-[#142c4c] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Player List (One per line)</label>
                  <textarea
                    rows={4}
                    value={team1PlayersText}
                    onChange={(e) => setTeam1PlayersText(e.target.value)}
                    className="w-full bg-[#0b1a2e] border border-[#142c4c] rounded-xl p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Team 2 */}
              <div className="bg-[#071322] p-4 rounded-xl border border-[#142c4c] space-y-3">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Team 2 Details
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Team Name</label>
                  <input
                    type="text"
                    value={team2Name}
                    onChange={(e) => setTeam2Name(e.target.value)}
                    className="w-full bg-[#0b1a2e] border border-[#142c4c] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Player List (One per line)</label>
                  <textarea
                    rows={4}
                    value={team2PlayersText}
                    onChange={(e) => setTeam2PlayersText(e.target.value)}
                    className="w-full bg-[#0b1a2e] border border-[#142c4c] rounded-xl p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Toss */}
            <div className="bg-[#071322] p-4 rounded-xl border border-[#142c4c] flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-slate-200">Toss Outcome</div>
                <div className="text-xs text-slate-400 mt-0.5">Who won the toss and their decision?</div>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={tossWinner}
                  onChange={(e) => setTossWinner(Number(e.target.value) as 1 | 2)}
                  className="bg-[#0b1a2e] border border-[#142c4c] rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value={1}>{team1Name || 'Team 1'}</option>
                  <option value={2}>{team2Name || 'Team 2'}</option>
                </select>

                <span className="text-xs text-slate-400">chose to</span>

                <select
                  value={tossDecision}
                  onChange={(e) => setTossDecision(e.target.value as 'bat' | 'bowl')}
                  className="bg-[#0b1a2e] border border-[#142c4c] rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="bat">Bat</option>
                  <option value="bowl">Bowl</option>
                </select>
              </div>
            </div>

            {/* Match Theme Picker */}
            {onSelectTheme && (
              <div className="bg-[#071322] p-4 rounded-xl border border-[#142c4c] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <Palette className="w-3.5 h-3.5" />
                    Choose Match Theme
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300">
                    {THEME_OPTIONS[currentTheme]?.name || 'Bright Sunny'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.values(THEME_OPTIONS).map((opt) => {
                    const isSelected = opt.id === currentTheme;
                    return (
                      <button
                        type="button"
                        key={opt.id}
                        onClick={() => onSelectTheme(opt.id)}
                        className={`text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-[#10253f] border-amber-400/60 shadow-sm ring-1 ring-amber-400/30'
                            : 'bg-[#0b1a2e] hover:bg-[#10253f] border-[#142c4c]'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span
                              className={`text-xs font-bold ${
                                isSelected ? 'text-amber-400' : 'text-white'
                              }`}
                            >
                              {opt.name}
                            </span>
                            {isSelected && (
                              <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full border border-amber-400/30">
                                <Check className="w-2.5 h-2.5" /> Active
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-300 truncate mt-0.5">
                            {opt.tagline}
                          </p>
                          <div className="flex items-center gap-1 mt-1.5">
                            {opt.swatches.map((c, i) => (
                              <span
                                key={i}
                                className="w-2.5 h-2.5 rounded-full border border-black/20 inline-block"
                                style={{ backgroundColor: c }}
                              />
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action footer */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#142c4c]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-[#10253f] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md shadow-amber-400/20 transition-all active:scale-95"
              >
                Create & Start Match →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
