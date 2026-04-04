import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

/** Search input with clear button for filtering tasks by text */
export function SearchBar({ value, onChangeText }: SearchBarProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.inputBorder }]}>
      <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>🔍</Text>
      <TextInput
        style={[styles.input, { color: colors.textPrimary }]}
        placeholder="Search tasks..."
        placeholderTextColor={colors.inputPlaceholder}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          style={styles.clearButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Text style={[styles.clearIcon, { color: colors.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 14,
  },
});
