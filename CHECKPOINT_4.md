# 🏏 Checkpoint 4 — RunCrick (PitchPoint Cricket Scorer)

**Checkpoint Version:** 4.0  
**Applet ID:** `fa033d25-e184-40a7-8038-9d8b9e687563`  
**Application Title:** RunCrick Live Cricket Scorer & Analytics  
**Default Match Preset:** Sydney Sharks vs Lankan Lions at Galungara Park (SSL Premier League)

---

## 📍 Where the App is Stored

1. **Active Codebase Workspace:**
   - Stored in the container's root directory: `/app/applet` (accessed via `/` in tool paths).
   - All source code lives in `/src/`:
     - `src/App.tsx`: Main application controller, tab navigation, match loop, keyboard handlers, and layout wrappers.
     - `src/components/Header.tsx`: Top header navigation, theme switcher dropdown, focus mode toggle, and mobile bottom bar.
     - `src/components/LiveScoreboard.tsx`: Batting & bowling cards with enlarged mobile typography and strike-rotation controls.
     - `src/components/ScoringKeypad.tsx`: Ball-by-ball scoring keypad (`0, 1, 2, 3, 4, 6, OUT`), extras, and undo engine.
     - `src/components/MatchSetupModal.tsx`: Match configuration modal supporting custom overs, team names, venues, and theme selection.
     - `src/components/ScorecardView.tsx`: Full interactive scorecard with dismissals, extras, fall-of-wickets, and bowler figures.
     - `src/components/PlayerStatsView.tsx`: Match statistics, leaderboards, economy rates, strike rates, and MVP calculations.
     - `src/components/OverAnalysisView.tsx`: Worm graph chart and over-by-over run breakdowns.
     - `src/theme/colors.ts` & `src/index.css`: Multi-theme CSS variable design system supporting 4 distinct themes.
     - `src/utils/cricketEngine.ts`: Complete cricket rules engine (strike rotation, over completion, extras, bowler tracking, target chasing).

2. **Cloud Hosting Environment:**
   - Deployed on a managed Cloud Run container runtime in `asia-southeast1`.
   - **Internal Dev URL:** `https://ais-dev-e5fkezmrzdbht7eujdrztk-283385649031.asia-southeast1.run.app`
   - **Public Shared Preview URL:** `https://ais-pre-e5fkezmrzdbht7eujdrztk-283385649031.asia-southeast1.run.app`

3. **Persistent Browser Storage:**
   - **Match State:** Persisted in `localStorage` under `pitchpoint_cricket_match_v2`. Any ball scored, wicket taken, or bowler changed is automatically preserved across refreshes.
   - **Active Theme:** Persisted in `localStorage` under `runcrick_theme` (defaults to `bright_sunny`).

---

## 🛠️ Key Enhancements in Checkpoint 4

### 1. Public Link Mobile Bottom Bar Fix (Platform Footer Resolution)
- **The Issue:** When accessing the public preview URL (`ais-pre-...run.app`), Google AI Studio renders an iframe footer bar across the bottom containing: *"This app was developed by another user"* along with *Chat*, *Preview*, and *Artifacts* buttons (~60–80px height). In previous versions, the app locked mobile scrolling with `overflow-hidden`, causing the lower scoring keypad buttons (`0, 1, 2, 3, 4, 6`, `OUT`, `Undo`) to be hidden behind the platform bar.
- **The Solution:**
  1. **Dynamic Mobile Scroll:** Removed `overflow-hidden` on mobile viewports and replaced with `min-h-[100dvh] overflow-y-auto`, while preserving the single-screen dashboard experience on desktop (`md:h-[100dvh] md:overflow-hidden`).
  2. **128px Bottom Clearance:** Configured generous bottom padding (`pb-32 sm:pb-24 md:pb-0`) on the Scorer tab. When scrolled down, the entire scoring console sits cleanly above all bottom bars with ample thumb room.
  3. **Scorer Focus Mode:** Added a one-tap **Focus Mode** (`Maximize2`/`Minimize2`) toggle in the top header. When active, it collapses the app's 56px bottom navigation bar, instantly giving 100% of the screen height to the scoring console. A floating `"Show Menu"` pill allows instant restoration at any time.

### 2. Multi-Theme Engine with 4 Day & Night Themes
- **☀️ Bright Sunny (Light Theme):** High-contrast daytime theme tailored for outdoor sunlight readability. Features crisp slate-100 card surfaces, deep slate-900 typography, vivid amber accents, and pure white text on red wicket buttons.
- **🌤️ Day Bright Colors:** Fresh daytime theme with vivid sky blue cards, crisp borders, and energetic turquoise highlights.
- **🏏 Classic Turf:** Deep cricket pitch turf greens with ivory cards and golden accents.
- **🦁 Sri Lanka Gold & Navy:** Tournament championship deep lion navy blue with vibrant gold headers and glowing borders.

### 3. Center-Aligned Theme Selector Modal
- Converted mobile theme selector into a React Portal (`createPortal(..., document.body)`), rendering directly at document level.
- Fixed the previous bug where parent header `backdrop-blur` and overflow clipping pushed the modal downwards or hid upper theme options. All 4 themes are now centered and fully accessible.

### 4. Custom Overs Configuration
- Added the ability to set any custom match overs (e.g. 5, 8, 10, 12, 15, 20, 50 overs) during match setup or preset loading.
- Real-time recalculation of remaining balls, target calculations, and required run rate (RRR).

### 5. Mobile Typography & Card Alignment
- Enlarged fonts for current batsman runs, balls faced, strike rate, and bowler figures on mobile screens.
- Symmetrical 4-tier vertical alignment between the Batting Card and Bowling Card for immediate clarity during fast-paced play.

---

## 📱 How to Run in Pure Fullscreen (Without the AI Studio Banner)
If you want to completely remove the AI Studio bottom banner on your phone:
1. Open the public link in your mobile browser (**Safari** on iOS or **Chrome** on Android).
2. Tap the browser share/menu button:
   - **iOS Safari:** Tap the **Share** icon (square with arrow) ➔ select **"Add to Home Screen"**.
   - **Android Chrome:** Tap the **three dots menu (⋮)** ➔ select **"Install App"** or **"Add to Home screen"**.
3. Launch the app directly from your phone's home screen icon. It will open in **standalone PWA mode** — completely removing the browser URL bar, AI Studio iframe wrapper, and platform footer for a 100% native app experience!
