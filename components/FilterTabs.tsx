import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FilterType } from '@/types/task';

interface FilterTabsProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: { all: number; active: number; completed: number };
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
];

/** Horizontal filter tabs for All / Active / Completed */
export function FilterTabs({ filter, onFilterChange, taskCounts }: FilterTabsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {FILTERS.map(({ key, label }) => {
        const isActive = filter === key;
        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.tab,
              { backgroundColor: colors.surface, borderColor: colors.border },
              isActive && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
            ]}
            onPress={() => onFilterChange(key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.textSecondary },
                isActive && { color: colors.primary },
              ]}
            >
              {label} ({taskCounts[key]})
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
