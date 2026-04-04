import { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { TaskItem } from '@/components/TaskItem';
import { Task } from '@/types/task';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  emptyComponent: React.ReactElement;
}

/** Renders the scrollable task list using FlatList */
export function TaskList({ tasks, onToggle, onDelete, emptyComponent }: TaskListProps) {
  const renderItem = useCallback(
    ({ item }: { item: Task }) => (
      <TaskItem task={item} onToggle={onToggle} onDelete={onDelete} />
    ),
    [onToggle, onDelete]
  );

  const keyExtractor = useCallback((item: Task) => item.id, []);

  return (
    <FlatList
      data={tasks}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListEmptyComponent={emptyComponent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={tasks.length === 0 ? styles.emptyContainer : styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  separator: {
    height: 8,
  },
});
