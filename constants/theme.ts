// HotspotManager Design System
// iOS 26-inspired dark glass morphism with cyan accent

export const theme = {
    // Primary palette
    primary: '#00E5CC',
    primaryLight: '#33FFEE',
    primaryDark: '#00B3A0',
    primaryMuted: 'rgba(0, 229, 204, 0.15)',

    // Backgrounds
    background: '#000000',
    backgroundSecondary: '#0A0A0F',
    surface: 'rgba(255, 255, 255, 0.06)',
    surfaceElevated: 'rgba(255, 255, 255, 0.10)',
    surfaceGlass: 'rgba(255, 255, 255, 0.08)',

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.55)',
    textTertiary: 'rgba(255, 255, 255, 0.35)',

    // Status colors
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',

    // Device type colors
    devicePhone: '#8B5CF6',
    deviceTablet: '#F59E0B',
    deviceLaptop: '#3B82F6',
    deviceDesktop: '#10B981',
    deviceOther: '#6B7280',

    // Border
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.12)',

    // Gradients
    gradientPrimary: ['#00E5CC', '#00B3A0'] as const,
    gradientDanger: ['#F87171', '#DC2626'] as const,
    gradientGlass: ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)'] as const,
    gradientDark: ['#0A0A0F', '#000000'] as const,

    // Spacing
    spacing: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        xxl: 24,
        xxxl: 32,
    },

    // Border radius (iOS 26 style - very rounded)
    radius: {
        sm: 8,
        md: 14,
        lg: 20,
        xl: 24,
        xxl: 28,
        full: 9999,
    },

    // Typography
    typography: {
        heroValue: { fontSize: 56, fontWeight: '200' as const, letterSpacing: -2 },
        heroLabel: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.5, textTransform: 'uppercase' as const },
        title: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
        subtitle: { fontSize: 20, fontWeight: '600' as const },
        body: { fontSize: 15, fontWeight: '400' as const },
        bodyBold: { fontSize: 15, fontWeight: '600' as const },
        caption: { fontSize: 13, fontWeight: '500' as const },
        micro: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.5, textTransform: 'uppercase' as const },
        stat: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -1 },
        statLabel: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1, textTransform: 'uppercase' as const },
    },

    // Shadows
    shadow: {
        card: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
        },
        elevated: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 8,
        },
        glow: {
            shadowColor: '#00E5CC',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
        },
    },
} as const;
