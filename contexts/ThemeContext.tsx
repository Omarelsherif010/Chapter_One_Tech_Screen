import { createContext, ReactNode, useContext } from 'react';
import { useColorScheme } from 'react-native';

import { DarkColors, LightColors, ThemeColors } from '@/constants/Colors';

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: LightColors,
  isDark: false,
});

/** Provides theme colors based on system appearance (light/dark) */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = isDark ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Hook to access the current theme colors and dark mode state */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
