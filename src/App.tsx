import React, { useState, useEffect, useCallback } from 'react';
import { Match, ExtraType, DismissalType } from './types/cricket';
import { defaultMatch } from './data/presetMatches';
import {
  recordDelivery,
  swapStrike,
  changeBowler,
  startSecondInnings,
} from './utils/cricketEngine';
import { Header, NavTab } from './components/Header';
import { LiveScoreboard } from './components/LiveScoreboard';
import { ScoringKeypad } from './components/ScoringKeypad';
import { ScorecardView } from './components/ScorecardView';
import { PlayerStatsView } from './components/PlayerStatsView';
import { OverAnalysisView } from './components/OverAnalysisView';
import { WicketModal } from './components/WicketModal';
import { BowlerSelectModal } from './components/BowlerSelectModal';
import { MatchSetupModal } from './components/MatchSetupModal';
import { ThemeId, DEFAULT_THEME } from './theme/colors';
import { Trophy, Activity, RotateCcw, AlertCircle, Layers } from 'lucide-react';

const STORAGE_KEY = 'pitchpoint_cricket_match_v2';
const THEME_KEY = 'runcrick_theme';

export default function App() {
  // Theme state: defaults to Bright Sunny Day Theme, supports Day Bright Colors, Classic Turf, and Sri Lanka Navy & Gold
  const [theme, setTheme] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (
        saved === 'bright_sunny' ||
        saved === 'day_bright' ||
        saved === 'classic_turf' ||
        saved === 'srilanka'
      ) {
        return saved as ThemeId;
      }
      if (saved === 'classic') return 'classic_turf';
    } catch (e) {
      console.error('Failed to read theme:', e);
    }
    return DEFAULT_THEME;
  });

  const handleSelectTheme = useCallback((newTheme: ThemeId) => {
    setTheme(newTheme);
    try {
      localStorage.setItem(THEME_KEY, newTheme);
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load saved match from localStorage or use default exciting T20 thriller
  const [match, setMatch] = useState<Match>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load saved match:', e);
    }
    return defaultMatch;
  });

  // Snapshot history for seamless Undo
  const [history, setHistory] = useState<Match[]>([]);

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<NavTab>('scorer');

  // Modal dialog states
  const [isWicketModalOpen, setIsWicketModalOpen] = useState(false);
  const [isBowlerModalOpen, setIsBowlerModalOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  // Focus Mode state: collapses mobile navigation bar to reclaim 56px for scorer keypad
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Over completion notification banner
  const [overCompletedNotification, setOverCompletedNotification] = useState<string | null>(null);

  // Save to localStorage whenever match state updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
    } catch (e) {
      console.error('Failed to persist match:', e);
    }
  }, [match]);

  // Record a standard or extra ball
  const handleRecordBall = useCallback(
    (params: {
      strikerRuns: number;
      extraType?: ExtraType;
      extraRuns?: number;
      isWicket?: boolean;
    }) => {
      setHistory((prev) => [...prev, JSON.parse(JSON.stringify(match))]);

      const prevLegalBalls = match.innings[match.currentInningsIndex].legalBalls;
      const updatedMatch = recordDelivery(match, params);
      setMatch(updatedMatch);

      const newInnings = updatedMatch.innings[updatedMatch.currentInningsIndex];
      // Check if over was completed on this delivery
      const isLegal = params.extraType !== 'wide' && params.extraType !== 'no-ball';
      if (isLegal && newInnings.legalBalls > 0 && newInnings.legalBalls % 6 === 0) {
        const completedOverNum = newInnings.legalBalls / 6;
        setOverCompletedNotification(
          `Over ${completedOverNum} complete! Please select the bowler for over ${completedOverNum + 1}.`
        );
        setIsBowlerModalOpen(true);
      } else {
        setOverCompletedNotification(null);
      }
    },
    [match]
  );

  // Record a wicket dismissal
  const handleConfirmWicket = useCallback(
    (params: {
      wicketType: DismissalType;
      outBatsmanId: string;
      fielderId?: string;
      fielderName?: string;
      nextBatsmanId?: string;
      strikerRuns: number;
    }) => {
      setHistory((prev) => [...prev, JSON.parse(JSON.stringify(match))]);

      const updatedMatch = recordDelivery(match, {
        strikerRuns: params.strikerRuns,
        isWicket: true,
        wicketType: params.wicketType,
        outBatsmanId: params.outBatsmanId,
        fielderId: params.fielderId,
        fielderName: params.fielderName,
        nextBatsmanId: params.nextBatsmanId,
      });

      setMatch(updatedMatch);

      const newInnings = updatedMatch.innings[updatedMatch.currentInningsIndex];
      if (newInnings.legalBalls > 0 && newInnings.legalBalls % 6 === 0) {
        setIsBowlerModalOpen(true);
      }
    },
    [match]
  );

  // Undo Last Ball
  const handleUndoBall = useCallback(() => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setMatch(previousState);
    setOverCompletedNotification(null);
  }, [history]);

  // Swap Strike
  const handleSwapStrike = useCallback(() => {
    setHistory((prev) => [...prev, JSON.parse(JSON.stringify(match))]);
    setMatch((prev) => swapStrike(prev));
  }, [match]);

  // Change Bowler
  const handleSelectBowler = useCallback(
    (bowlerId: string) => {
      setMatch((prev) => changeBowler(prev, bowlerId));
      setOverCompletedNotification(null);
    },
    []
  );

  // Start Second Innings
  const handleStartSecondInnings = useCallback(() => {
    setHistory((prev) => [...prev, JSON.parse(JSON.stringify(match))]);
    setMatch((prev) => startSecondInnings(prev));
    setOverCompletedNotification(null);
  }, [match]);

  // Reset match to fresh starting state
  const handleResetMatch = useCallback(() => {
    if (window.confirm('Reset current match back to 0.0 overs?')) {
      setHistory([]);
      setMatch(defaultMatch);
      localStorage.removeItem(STORAGE_KEY);
      setOverCompletedNotification(null);
    }
  }, []);

  // Start brand new custom match
  const handleStartNewMatch = useCallback((newMatch: Match) => {
    setHistory([]);
    setMatch(newMatch);
    setActiveTab('scorer');
    setOverCompletedNotification(null);
  }, []);

  // Keyboard shortcuts for rapid live scoring
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea or modal is open
      if (
        isWicketModalOpen ||
        isBowlerModalOpen ||
        isSetupModalOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (activeTab === 'scorer') {
        if (['0', '1', '2', '3', '4', '6'].includes(e.key)) {
          e.preventDefault();
          handleRecordBall({ strikerRuns: parseInt(e.key) });
        } else if (e.key.toLowerCase() === 'w') {
          e.preventDefault();
          setIsWicketModalOpen(true);
        } else if (e.key.toLowerCase() === 'u') {
          e.preventDefault();
          handleUndoBall();
        } else if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          handleSwapStrike();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    activeTab,
    isWicketModalOpen,
    isBowlerModalOpen,
    isSetupModalOpen,
    handleRecordBall,
    handleUndoBall,
    handleSwapStrike,
  ]);

  const isSriLanka = theme === 'srilanka';
  const isScorerTab = activeTab === 'scorer';

  return (
    <div
      data-theme={theme}
      className={`${
        isScorerTab
          ? 'min-h-[100dvh] overflow-y-auto md:h-[100dvh] md:max-h-[100dvh] md:overflow-hidden'
          : 'min-h-screen pb-28 md:pb-0'
      } theme-canvas-bg text-slate-100 flex flex-col font-sans transition-colors duration-200`}
    >
      {/* Top Header with Brand & Desktop Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'setup') {
            setIsSetupModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onNewMatchClick={() => setIsSetupModalOpen(true)}
        onResetMatchClick={handleResetMatch}
        matchStatus={match.status}
        currentTheme={theme}
        onSelectTheme={handleSelectTheme}
        isFocusMode={isFocusMode}
        onToggleFocusMode={() => setIsFocusMode((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 max-w-7xl w-full mx-auto ${
          isScorerTab
            ? 'p-2 sm:px-6 sm:py-4 overflow-y-auto md:overflow-visible flex flex-col justify-between'
            : 'px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto'
        }`}
      >
        {/* Match Concluded Victory Banner */}
        {match.status === 'completed' && (
          <div
            className={`${
              isSriLanka
                ? 'bg-gradient-to-r from-amber-500/20 via-[#10253f] to-sky-600/20 border-amber-400/40'
                : 'bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-amber-500/20 border-amber-500/40'
            } border rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 shrink-0`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <Trophy className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Match Final Result
                </div>
                <div className="text-sm sm:text-2xl font-black text-white mt-0.5">
                  {match.resultSummary}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('scorecard')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white ${
                  isSriLanka
                    ? 'bg-[#10253f] hover:bg-[#142c4c] border-[#1a365d]'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                } rounded-lg border transition-colors`}
              >
                Scorecard
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md shadow-amber-400/20 transition-all active:scale-95"
              >
                Awards & MVP
              </button>
            </div>
          </div>
        )}

        {/* Over Complete Prompt Banner */}
        {overCompletedNotification && (
          <div className="bg-amber-400/10 border border-amber-400/30 rounded-lg sm:rounded-xl p-2 sm:p-3.5 flex items-center justify-between text-xs text-amber-300 gap-2 shadow-sm shrink-0">
            <div className="flex items-center gap-1.5 truncate">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-amber-400" />
              <span className="truncate">{overCompletedNotification}</span>
            </div>
            <button
              onClick={() => setIsBowlerModalOpen(true)}
              className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-300 shadow-sm transition-colors whitespace-nowrap active:scale-95"
            >
              Select Bowler
            </button>
          </div>
        )}

        {/* Page 1: Live Scorer (Fully accessible with generous bottom clearance on mobile) */}
        {activeTab === 'scorer' && (
          <div
            className={`flex-1 flex flex-col justify-between gap-1.5 sm:gap-6 overflow-visible ${
              isFocusMode
                ? 'pb-16 sm:pb-8 md:pb-0'
                : 'pb-32 sm:pb-24 md:pb-0'
            }`}
          >
            <LiveScoreboard
              match={match}
              onSwapStrike={handleSwapStrike}
              onChangeBowler={() => setIsBowlerModalOpen(true)}
            />

            <ScoringKeypad
              match={match}
              onRecordBall={handleRecordBall}
              onOpenWicketModal={() => setIsWicketModalOpen(true)}
              onOpenBowlerModal={() => setIsBowlerModalOpen(true)}
              onSwapStrike={handleSwapStrike}
              onUndoBall={handleUndoBall}
              onStartSecondInnings={handleStartSecondInnings}
              canUndo={history.length > 0}
            />

            {/* Quick Keyboard Shortcuts Hint (Desktop only) */}
            <div className="hidden md:flex text-[11px] text-slate-400 flex-wrap items-center justify-center gap-4 py-1">
              <span className="font-medium text-slate-300">Keyboard Shortcuts:</span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-[#0b1a2e] border border-[#142c4c] rounded text-amber-300 font-mono-num font-semibold">
                  0-6
                </kbd>{' '}
                Runs
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-[#0b1a2e] border border-[#142c4c] rounded text-rose-300 font-mono-num font-semibold">
                  W
                </kbd>{' '}
                Wicket
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-[#0b1a2e] border border-[#142c4c] rounded text-slate-300 font-mono-num font-semibold">
                  S
                </kbd>{' '}
                Swap Strike
              </span>
              <span>
                <kbd className="px-1.5 py-0.5 bg-[#0b1a2e] border border-[#142c4c] rounded text-slate-300 font-mono-num font-semibold">
                  U
                </kbd>{' '}
                Undo Ball
              </span>
            </div>
          </div>
        )}

        {/* Page 2: Full Live Scorecard */}
        {activeTab === 'scorecard' && <ScorecardView match={match} />}

        {/* Page 3: Player Performance Statistics */}
        {activeTab === 'stats' && <PlayerStatsView match={match} />}

        {/* Page 4: Over-by-Over & Run Worm Analysis */}
        {activeTab === 'overs' && <OverAnalysisView match={match} />}
      </main>

      {/* Footer (Hidden on mobile scoring screen to guarantee zero-scroll; shown on desktop and other pages) */}
      <footer
        className={`${
          isScorerTab ? 'hidden md:block' : 'block pb-16 md:pb-5'
        } border-t ${
          isSriLanka ? 'border-[#142c4c] bg-[#071322]' : 'border-slate-800 bg-slate-950'
        } text-slate-400 text-xs py-5 mt-auto`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">RunCrick Scoring Engine</span>
            <span aria-hidden="true" className="text-amber-400">·</span>
            <span className="text-slate-400">Cricket Scoring Cockpit</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-slate-400 text-[11px]">Theme:</span>
            <button
              onClick={() => handleSelectTheme('bright_sunny')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                theme === 'bright_sunny' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              ☀️ Bright Sunny
            </button>
            <button
              onClick={() => handleSelectTheme('day_bright')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                theme === 'day_bright' ? 'bg-sky-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              🌤️ Day Bright
            </button>
            <button
              onClick={() => handleSelectTheme('classic_turf')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                theme === 'classic_turf' ? 'bg-emerald-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏏 Classic Turf
            </button>
            <button
              onClick={() => handleSelectTheme('srilanka')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                theme === 'srilanka' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              🦁 SL Navy
            </button>
            <span aria-hidden="true" className="text-slate-600">|</span>
            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              New Match
            </button>
            <button
              onClick={handleResetMatch}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Reset Scorer
            </button>
          </div>
        </div>
      </footer>

      {/* Wicket Modal */}
      <WicketModal
        isOpen={isWicketModalOpen}
        onClose={() => setIsWicketModalOpen(false)}
        match={match}
        onConfirmWicket={handleConfirmWicket}
      />

      {/* Bowler Selection Modal */}
      <BowlerSelectModal
        isOpen={isBowlerModalOpen}
        onClose={() => setIsBowlerModalOpen(false)}
        match={match}
        onSelectBowler={handleSelectBowler}
      />

      {/* Match Setup / Presets Modal */}
      <MatchSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onStartMatch={handleStartNewMatch}
        currentTheme={theme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Floating Restore Nav button when in Focus Mode on Mobile */}
      {isFocusMode && (
        <button
          onClick={() => setIsFocusMode(false)}
          className="md:hidden fixed bottom-4 right-4 z-50 bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 text-xs border border-amber-300 active:scale-95 transition-transform"
          title="Exit Focus Mode (Show Bottom Menu)"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Show Menu</span>
        </button>
      )}
    </div>
  );
}
