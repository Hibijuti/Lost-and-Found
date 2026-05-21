/**
 * School Lost & Found — Fun Green primary, soft light green surfaces.
 */
export const Brand = {
  lightningYellow: '#FCC327',
  softGreen: '#E8F4EC',
  softGreenDeep: '#D4EBDD',
  funGreen: '#015E2F',
  funGreenDark: '#014026',
  funGreenLight: '#027A48',
} as const;

export const AppTheme = {
  primary: Brand.funGreen,
  primaryDark: Brand.funGreenDark,
  primaryLight: Brand.funGreenLight,
  accent: Brand.lightningYellow,
  /** Main screen background — soft light green (replaces yellow Milan) */
  surface: Brand.softGreen,
  surfaceCard: '#FFFFFF',
  surfaceElevated: '#F6FBF8',
  surfaceDark: '#0D2818',
  border: '#B8D4C4',
  borderDark: '#2A4D38',
  danger: '#C41E3A',
  success: Brand.funGreen,
  /** Headings, labels — high contrast */
  text: Brand.funGreenDark,
  textOnPrimary: '#FFFFFF',
  /** Secondary body text on cards / hints */
  textSecondary: '#1E3D2F',
  textMuted: '#2A5240',
  textMutedDark: '#B8D4C4',
  /** Form fields — WCAG-friendly contrast on light green + white cards */
  inputLabel: '#012214',
  inputText: '#000000',
  inputPlaceholder: '#1F3D30',
  placeholder: '#1F3D30',
  badgeLostBg: '#FFF3CD',
  badgeFoundBg: '#C8E6D0',
  headerGradient: [Brand.funGreen, Brand.funGreenLight] as const,
  headerGradientAuth: [Brand.funGreenDark, Brand.funGreen] as const,
  radius: {
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
    full: 999,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 28,
  },
  typography: {
    hero: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.5 },
    title: { fontSize: 22, fontWeight: '800' as const, letterSpacing: -0.3 },
    subtitle: { fontSize: 15, fontWeight: '500' as const, lineHeight: 22 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    caption: { fontSize: 13, fontWeight: '500' as const },
    label: { fontSize: 14, fontWeight: '700' as const },
  },
  cardShadow: {
    shadowColor: Brand.funGreenDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  softShadow: {
    shadowColor: Brand.funGreenDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
};
