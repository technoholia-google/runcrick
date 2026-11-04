/**
 * RunCrick Cricket Scoring Themes
 *
 * Provides dedicated daylight and match atmosphere themes:
 * 1. bright_sunny: High-contrast daylight/outdoor theme with crisp white cards,
 *                  sunny amber & daylight azure accents, dark readable text for direct sunlight.
 * 2. day_bright:   Energetic, vibrant daytime athletic palette with sky blues & sun gold.
 * 3. classic_turf: Traditional cricket ground emerald grass & pitch leather theme.
 * 4. srilanka:     Official international Sri Lanka Cricket Navy & Gold colors.
 */

export type ThemeId = 'bright_sunny' | 'day_bright' | 'classic_turf' | 'srilanka';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  badge: string;
  category: 'Day Theme' | 'Night / Traditional';
  tagline: string;
  icon: 'sun' | 'sun-medium' | 'shield' | 'award';
  isLight: boolean;
  swatches: [string, string, string]; // [bg, surface, accent]
  primaryColor: string;
  accentBadgeClass: string;
}

export const THEME_OPTIONS: Record<ThemeId, ThemeOption> = {
  bright_sunny: {
    id: 'bright_sunny',
    name: 'Bright Sunny (Light)',
    badge: 'Bright Sunny',
    category: 'Day Theme',
    tagline: 'Crisp light daylight theme engineered for outdoor matches & direct sunlight',
    icon: 'sun',
    isLight: true,
    swatches: ['#f8fafc', '#ffffff', '#d97706'],
    primaryColor: '#d97706',
    accentBadgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  day_bright: {
    id: 'day_bright',
    name: 'Day Bright Colors',
    badge: 'Day Bright',
    category: 'Day Theme',
    tagline: 'Vibrant daytime palette with vivid sky azure & radiant golden sunshine',
    icon: 'sun-medium',
    isLight: false,
    swatches: ['#0c1a36', '#12264f', '#38bdf8'],
    primaryColor: '#38bdf8',
    accentBadgeClass: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
  },
  classic_turf: {
    id: 'classic_turf',
    name: 'Classic Turf',
    badge: 'Classic Turf',
    category: 'Day Theme',
    tagline: 'Iconic cricket ground emerald turf, pitch grass & crisp whites',
    icon: 'shield',
    isLight: false,
    swatches: ['#02160d', '#062b1b', '#10b981'],
    primaryColor: '#10b981',
    accentBadgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
  },
  srilanka: {
    id: 'srilanka',
    name: 'Sri Lanka Navy & Gold',
    badge: 'SL Navy & Gold',
    category: 'Night / Traditional',
    tagline: 'International Sri Lanka team colors with Lion Royal Navy & Vibrant Gold',
    icon: 'award',
    isLight: false,
    swatches: ['#06111f', '#0b1a2e', '#fbbf24'],
    primaryColor: '#fbbf24',
    accentBadgeClass: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
  },
};

// Default daylight theme
export const DEFAULT_THEME: ThemeId = 'bright_sunny';
