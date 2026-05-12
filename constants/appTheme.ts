/**
 * School Lost & Found brand palette (RGB reference).
 * Lightning Yellow #FCC327 — accent, highlights
 * Milan #FFFFA5 — soft screen backgrounds
 * Fun Green #015E2F — primary actions, headers, links
 */
export const Brand = {
  lightningYellow: '#FCC327',
  milan: '#FFFFA5',
  funGreen: '#015E2F',
  /** Pressed / headings — darker Fun Green */
  funGreenDark: '#014026',
} as const;

export const AppTheme = {
  primary: Brand.funGreen,
  primaryDark: Brand.funGreenDark,
  accent: Brand.lightningYellow,
  /** Main list / tab screen backgrounds */
  surface: Brand.milan,
  /** Cards & auth screens — white reads best on Milan */
  surfaceCard: '#FFFFFF',
  surfaceDark: '#0D2818',
  border: '#C8D9B8',
  borderDark: '#2A4D38',
  danger: '#C41E3A',
  success: Brand.funGreen,
  textMuted: '#2F5C3E',
  textMutedDark: '#B8D4C4',
  /** Lost / found pills */
  badgeLostBg: '#FFEAA7',
  badgeFoundBg: '#C5EBD0',
  cardShadow: {
    shadowColor: Brand.funGreenDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
};
