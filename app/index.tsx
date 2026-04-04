import { useCallback, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { FilterTabs } from '@/components/FilterTabs';
import { TaskInput } from '@/components/TaskInput';
import { TaskList } from '@/components/TaskList';
import { Colors } from '@/constants/Colors';
import { FilterType, Task } from '@/types/task';
import { generateId } from '@/utils/generateId';

/** Main screen that manages all task state and renders the task manager UI */
export default function TaskManagerScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter((t) => !t.completed);
      case 'completed':
        return tasks.filter((t) => t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const activeCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);

  const handleAddTask = useCallback((text: string) => {
    const newTask: Task = {
      id: generateId(),
      text,
      completed: false,
      createdAt: Date.now(),
      priority: 'medium',
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const handleToggleTask = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  }, []);

  const handleDeleteTask = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Task Manager</Text>
          <Text style={styles.counter}>
            {activeCount} task{activeCount !== 1 ? 's' : ''} remaining
          </Text>
        </View>

        {/* Input */}
        <TaskInput onAddTask={handleAddTask} />

        {/* Filter Tabs */}
        <FilterTabs
          filter={filter}
          onFilterChange={setFilter}
          taskCounts={{
            all: tasks.length,
            active: activeCount,
            completed: completedCount,
          }}
        />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
          emptyComponent={<EmptyState filter={filter} />}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  counter: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
