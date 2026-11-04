import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  PlusCircle,
  RotateCcw,
  Palette,
  Activity,
  ClipboardList,
  BarChart3,
  TrendingUp,
  Settings,
  Sun,
  SunMedium,
  Shield,
  Award,
  Check,
  ChevronDown,
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { ThemeId, THEME_OPTIONS } from '../theme/colors';

export type NavTab = 'scorer' | 'scorecard' | 'stats' | 'overs' | 'setup';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onNewMatchClick: () => void;
  onResetMatchClick: () => void;
  matchStatus: string;
  currentTheme?: ThemeId;
  onSelectTheme?: (theme: ThemeId) => void;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onNewMatchClick,
  onResetMatchClick,
  currentTheme = 'bright_sunny',
  onSelectTheme,
  isFocusMode = false,
  onToggleFocusMode,
}) => {
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileModalRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && dropdownRef.current.contains(target)) {
        return;
      }
      if (mobileModalRef.current && mobileModalRef.current.contains(target)) {
        return;
      }
      setIsThemePickerOpen(false);
    }
    if (isThemePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThemePickerOpen]);

  const currentThemeConfig = THEME_OPTIONS[currentTheme] || THEME_OPTIONS.bright_sunny;

  const renderThemeIcon = (id: ThemeId, className: string = 'w-3.5 h-3.5') => {
    switch (id) {
      case 'bright_sunny':
        return <Sun className={`${className} text-amber-500`} />;
      case 'day_bright':
        return <SunMedium className={`${className} text-sky-400`} />;
      case 'classic_turf':
        return <Shield className={`${className} text-emerald-400`} />;
      case 'srilanka':
        return <Award className={`${className} text-amber-400`} />;
      default:
        return <Palette className={`${className} text-amber-400`} />;
    }
  };

  const renderThemeOptionsList = () => (
    <div className="space-y-1.5">
      {Object.values(THEME_OPTIONS).map((opt) => {
        const isSelected = opt.id === currentTheme;
        return (
          <button
            key={opt.id}
            onClick={() => {
              onSelectTheme?.(opt.id);
              setIsThemePickerOpen(false);
            }}
            className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
              isSelected
                ? 'bg-[#10253f] border-amber-400/60 shadow-sm ring-1 ring-amber-400/30'
                : 'bg-[#071322]/80 hover:bg-[#10253f] border-[#142c4c]'
            }`}
          >
            <div className="mt-0.5 p-1.5 rounded-lg bg-[#050f1d] border border-[#142c4c] shrink-0">
              {renderThemeIcon(opt.id, 'w-4 h-4')}
            </div>

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
              <p className="text-[10.5px] text-slate-300 leading-tight mt-0.5">
                {opt.tagline}
              </p>

              {/* Swatch Previews */}
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="flex items-center gap-1">
                  {opt.swatches.map((c, i) => (
                    <span
                      key={i}
                      className="w-3 h-3 rounded-full border border-black/20 shadow-xs inline-block"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <span className="text-[9.5px] text-slate-400 font-medium">
                  {opt.category}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#071322]/95 backdrop-blur-md border-b border-[#142c4c] shrink-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-12 md:h-16 flex items-center justify-between gap-2 sm:gap-6">
          {/* Zone 1: Brand Zone */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-sm sm:text-lg shadow-sm">
              🏏
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-scoreboard text-base sm:text-2xl font-black tracking-tight text-white uppercase">
                  Run<span className="text-amber-400">Crick</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-400/15 text-amber-300 border border-amber-400/30 uppercase tracking-widest">
                  PRO SCORER
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block -mt-1 font-medium">
                Live Ball-by-Ball Match Engine
              </p>
            </div>
          </div>

          {/* Zone 2: Desktop Navigation Bar */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-xs font-medium text-slate-300 bg-[#0b1a2e]/60 px-2 py-1.5 rounded-xl border border-[#142c4c]">
            <button
              onClick={() => onTabChange('scorer')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 px-2.5 rounded-lg ${
                activeTab === 'scorer'
                  ? 'text-amber-400 font-bold bg-[#10253f] border border-amber-400/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Live Scorer
            </button>
            <button
              onClick={() => onTabChange('scorecard')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 px-2.5 rounded-lg ${
                activeTab === 'scorecard'
                  ? 'text-amber-400 font-bold bg-[#10253f] border border-amber-400/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Full Scorecard
            </button>
            <button
              onClick={() => onTabChange('stats')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 px-2.5 rounded-lg ${
                activeTab === 'stats'
                  ? 'text-amber-400 font-bold bg-[#10253f] border border-amber-400/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Player Stats
            </button>
            <button
              onClick={() => onTabChange('overs')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 px-2.5 rounded-lg ${
                activeTab === 'overs'
                  ? 'text-amber-400 font-bold bg-[#10253f] border border-amber-400/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Worm & Overs
            </button>
            <button
              onClick={() => onTabChange('setup')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 px-2.5 rounded-lg ${
                activeTab === 'setup'
                  ? 'text-amber-400 font-bold bg-[#10253f] border border-amber-400/30'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Match Setup
            </button>
          </nav>

          {/* Zone 3: Actions + Day/Night Theme Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 relative" ref={dropdownRef}>
            {/* Interactive Theme Selector Button */}
            {onSelectTheme && (
              <div className="relative">
                <button
                  onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
                  title="Choose Match Theme: Bright Sunny Light, Day Bright, Classic Turf, or SL Navy & Gold"
                  className="inline-flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-[#10253f] hover:bg-[#163357] rounded-lg border border-[#1a365d] transition-all shadow-sm active:scale-95"
                >
                  {renderThemeIcon(currentTheme)}
                  <span className="hidden sm:inline text-[11px] font-medium">
                    {currentThemeConfig.badge}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Desktop View: Anchored Dropdown under button */}
                {isThemePickerOpen && (
                  <div className="hidden sm:block absolute right-0 mt-2 w-80 rounded-2xl bg-[#0b1a2e] border border-[#1a365d] shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-2 py-1.5 mb-1.5 border-b border-[#142c4c]">
                      <div className="flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Choose Match Theme
                        </span>
                      </div>
                      <button
                        onClick={() => setIsThemePickerOpen(false)}
                        className="text-slate-400 hover:text-white p-0.5 rounded"
                        aria-label="Close"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {renderThemeOptionsList()}
                  </div>
                )}
              </div>
            )}

            {onToggleFocusMode && (
              <button
                onClick={onToggleFocusMode}
                title={isFocusMode ? "Exit Focus Mode (Show Bottom Navigation)" : "Scorer Focus Mode (Hide Bottom Navigation for maximum screen space)"}
                className={`inline-flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  isFocusMode
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-[#10253f] border-[#142c4c]'
                }`}
              >
                {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isFocusMode ? 'Normal View' : 'Focus Mode'}</span>
              </button>
            )}

            <button
              onClick={onResetMatchClick}
              title="Reset match back to 0.0 overs"
              className="inline-flex items-center gap-1 p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#10253f] rounded-lg border border-[#142c4c] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={onNewMatchClick}
              className="inline-flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md shadow-amber-400/20 transition-all whitespace-nowrap shrink-0 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[11px] sm:text-xs">New Match</span>
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Mobile Bottom Navigation Bar (Hidden when in Focus Mode) */}
      {!isFocusMode && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#071322]/98 backdrop-blur-lg border-t border-[#142c4c] h-14 flex items-center justify-around px-1 pb-safe shadow-2xl">
          <button
            onClick={() => onTabChange('scorer')}
            className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 rounded-lg transition-all min-h-[44px] ${
              activeTab === 'scorer'
                ? 'text-amber-400 font-bold bg-amber-400/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Scorer</span>
          </button>

          <button
            onClick={() => onTabChange('scorecard')}
            className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 rounded-lg transition-all min-h-[44px] ${
              activeTab === 'scorecard'
                ? 'text-amber-400 font-bold bg-amber-400/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Scorecard</span>
          </button>

          <button
            onClick={() => onTabChange('stats')}
            className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 rounded-lg transition-all min-h-[44px] ${
              activeTab === 'stats'
                ? 'text-amber-400 font-bold bg-amber-400/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Stats</span>
          </button>

          <button
            onClick={() => onTabChange('overs')}
            className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 rounded-lg transition-all min-h-[44px] ${
              activeTab === 'overs'
                ? 'text-amber-400 font-bold bg-amber-400/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Worm</span>
          </button>

          <button
            onClick={() => onTabChange('setup')}
            className={`flex-1 py-1 flex flex-col items-center justify-center gap-0.5 rounded-lg transition-all min-h-[44px] ${
              activeTab === 'setup'
                ? 'text-amber-400 font-bold bg-amber-400/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-[10px] tracking-tight">Setup</span>
          </button>
        </nav>
      )}

      {/* Mobile Theme Modal: Portaled directly to document.body so it attaches to true viewport, completely free of header backdrop-blur and overflow clipping */}
      {isThemePickerOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            data-theme={currentTheme}
            className="sm:hidden fixed inset-0 z-[100] flex items-center justify-center p-3.5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={() => setIsThemePickerOpen(false)}
          >
            <div
              ref={mobileModalRef}
              className="w-full max-w-[340px] rounded-2xl bg-[#0b1a2e] border border-[#1a365d] shadow-2xl p-3.5 max-h-[88dvh] overflow-y-auto animate-in zoom-in-95 duration-150 text-left my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#142c4c]">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/30 shrink-0">
                    <Palette className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Choose Match Theme
                    </h3>
                    <p className="text-[10px] text-slate-400 font-normal">
                      Select day, light, or turf colors
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsThemePickerOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#10253f] transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {renderThemeOptionsList()}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
