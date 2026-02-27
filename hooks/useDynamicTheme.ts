// Dynamic Theme Hook - Combines static theme with user customizations

import { useMemo } from 'react';
import { theme as staticTheme } from '../constants/theme';
import { useApp, UI_THEME_COLORS, CORNER_RADII } from '../contexts/AppContext';

export function useDynamicTheme() {
  const { uiSettings, cornerRadius } = useApp();
  
  const dynamicTheme = useMemo(() => {
    const themeColors = UI_THEME_COLORS[uiSettings.theme] || UI_THEME_COLORS.default;
    
    return {
      ...staticTheme,
      // Override with dynamic values
      primary: themeColors.accent,
      primaryLight: themeColors.accent + 'CC',
      primaryDark: themeColors.accent + '99',
      primaryMuted: themeColors.accent + '26',
      background: themeColors.bg,
      // Dynamic corner radius
      radius: {
        ...staticTheme.radius,
        sm: CORNER_RADII[uiSettings.cornerStyle] || 8,
        md: (CORNER_RADII[uiSettings.cornerStyle] || 8) * 1.75,
        lg: (CORNER_RADII[uiSettings.cornerStyle] || 8) * 3,
        xl: (CORNER_RADII[uiSettings.cornerStyle] || 8) * 3.5,
        xxl: (CORNER_RADII[uiSettings.cornerStyle] || 8) * 4,
        full: 9999,
      },
      // Dynamic shadow glow
      shadow: {
        ...staticTheme.shadow,
        glow: {
          ...staticTheme.shadow.glow,
          shadowColor: themeColors.accent,
        },
      },
    };
  }, [uiSettings.theme, uiSettings.cornerStyle]);
  
  return dynamicTheme;
}

export default useDynamicTheme;
