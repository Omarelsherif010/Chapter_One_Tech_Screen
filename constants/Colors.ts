/** Light theme color palette */
export const LightColors = {
  primary: '#4A90D9',
  primaryLight: '#EBF2FC',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  textPrimary: '#1A1A2E',
  textSecondary: '#6C757D',
  textCompleted: '#ADB5BD',
  danger: '#E74C3C',
  dangerLight: '#FDEDEC',
  success: '#27AE60',
  border: '#E9ECEF',
  separator: '#F1F3F5',
  inputBackground: '#FFFFFF',
  inputBorder: '#DEE2E6',
  inputPlaceholder: '#ADB5BD',
  priorityHigh: '#E74C3C',
  priorityMedium: '#F39C12',
  priorityLow: '#27AE60',
};

/** Dark theme color palette */
export const DarkColors: ThemeColors = {
  primary: '#5B9FE6',
  primaryLight: '#1A2A3E',
  background: '#121212',
  surface: '#1E1E1E',
  textPrimary: '#E8E8E8',
  textSecondary: '#9E9E9E',
  textCompleted: '#6B6B6B',
  danger: '#EF5350',
  dangerLight: '#2C1A1A',
  success: '#66BB6A',
  border: '#333333',
  separator: '#2A2A2A',
  inputBackground: '#1E1E1E',
  inputBorder: '#444444',
  inputPlaceholder: '#6B6B6B',
  priorityHigh: '#EF5350',
  priorityMedium: '#FFB74D',
  priorityLow: '#66BB6A',
};

/** Type for the color palette — shared between light and dark themes */
export type ThemeColors = typeof LightColors;

/** @deprecated Use useTheme().colors instead — kept for backward compatibility during migration */
export const Colors = LightColors;
