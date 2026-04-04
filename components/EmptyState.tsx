import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { FilterType } from '@/types/task';

interface EmptyStateProps {
  filter: FilterType;
}

/** Displayed when no tasks match the current filter */
export function EmptyState({ filter }: EmptyStateProps) {
  const getMessage = () => {
    switch (filter) {
      case 'active':
        return 'No active tasks. Great job!';
      case 'completed':
        return 'No completed tasks yet.';
      default:
        return 'No tasks yet. Add one above!';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📋</Text>
      <Text style={styles.message}>{getMessage()}</Text>
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
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
