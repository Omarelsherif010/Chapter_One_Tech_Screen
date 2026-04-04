import {
  KeyboardAvoidingView,
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
import { useTasks } from '@/hooks/useTasks';

/** Main screen that delegates all task logic to the useTasks hook */
export default function TaskManagerScreen() {
  const {
    filteredTasks,
    filter,
    activeCount,
    completedCount,
    totalCount,
    addTask,
    toggleTask,
    deleteTask,
    setFilter,
  } = useTasks();

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
        <TaskInput onAddTask={addTask} />

        {/* Filter Tabs */}
        <FilterTabs
          filter={filter}
          onFilterChange={setFilter}
          taskCounts={{
            all: totalCount,
            active: activeCount,
            completed: completedCount,
          }}
        />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
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
