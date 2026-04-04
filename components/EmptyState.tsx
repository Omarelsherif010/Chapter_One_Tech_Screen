import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';
import { FilterType } from '@/types/task';

interface EmptyStateProps {
  filter: FilterType;
  searchQuery?: string;
}

/** Displayed when no tasks match the current filter or search */
export function EmptyState({ filter, searchQuery }: EmptyStateProps) {
  const { colors } = useTheme();

  const getMessage = () => {
    if (searchQuery?.trim()) {
      return 'No tasks match your search.';
    }
    switch (filter) {
      case 'active':
        return 'No active tasks. Great job!';
      case 'completed':
        return 'No completed tasks yet.';
      default:
        return 'No tasks yet. Add one above!';
    }
  };

  const getIcon = () => (searchQuery?.trim() ? '🔍' : '📋');

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{getIcon()}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{getMessage()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});
