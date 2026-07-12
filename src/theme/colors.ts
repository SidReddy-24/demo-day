export const colors = {
  // Brand Colours (True Pink + Chill White combo)
  primary: '#FD1843',      // True Pink
  primaryLight: '#ffe4e6', // Soft light pink tint
  primaryDark: '#1c1c1e',  // Jet Black
  accent: '#1c1c1e',       // Jet Black

  // Neutral Palette
  background: '#FFF9FA',            // Chill White background
  backgroundSecondary: '#fdf2f4',   // Very soft pinkish tint for secondary backgrounds
  cardBackground: '#ffffff',        // Card base surface
  text: '#1c1c1e',                  // Dark charcoal / black
  textMuted: '#6b7280',             // Muted gray
  textLight: '#ffffff',
  border: '#e5e7eb',                // Gray border
  borderDark: '#1c1c1e',

  // Status & Risk Alert Colours
  riskLow: '#10b981',               // Emerald success green
  riskMedium: '#f59e0b',            // Amber caution orange
  riskHigh: '#FD1843',              // Crimson / True Pink danger red

  overlay: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',
};

export type ColorsType = typeof colors;
