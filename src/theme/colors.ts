export const colors = {
  // Brand Colours (Crimson Red + Deep Slate combo)
  primary: '#FF3B30',         // Crimson Red
  primaryLight: '#3A1E22',    // Dark red-tinted slate for active overlays/accents
  primaryDark: '#0A0F14',     // Near-black slate background core
  accent: '#E52E2E',          // Industrial Crimson Accent

  // Neutral Palette
  background: '#0B1117',            // Deep Slate Blue background
  backgroundSecondary: '#0F1722',   // Slightly lighter navy slate
  cardBackground: '#17222E',        // Navy-slate card base surface
  text: '#ECEFF3',                  // Crisp off-white/silver text
  textMuted: '#8A9CAE',             // Muted gray-blue
  textLight: '#ffffff',
  border: '#243345',                // Slate border
  borderDark: '#0B1117',

  // Status & Risk Alert Colours (matching 3rd pic palette styling)
  riskLow: '#10B981',               // Green
  riskMedium: '#F59E0B',            // Amber
  riskHigh: '#FF3B30',              // Crimson Red

  overlay: 'rgba(0, 0, 0, 0.75)',
  transparent: 'transparent',
};

export type ColorsType = typeof colors;
