import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { EmptyState } from '@/components/EmptyState';
import { FilterTabs } from '@/components/FilterTabs';
import { SearchBar } from '@/components/SearchBar';
import { TaskInput } from '@/components/TaskInput';
import { TaskList } from '@/components/TaskList';
import { useTheme } from '@/contexts/ThemeContext';
import { useTasks } from '@/hooks/useTasks';

/** Main screen that delegates all task logic to the useTasks hook */
export default function TaskManagerScreen() {
  const { colors } = useTheme();
  const {
    filteredTasks,
    filter,
    activeCount,
    completedCount,
    totalCount,
    searchQuery,
    isLoaded,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    setFilter,
    setSearchQuery,
  } = useTasks();

  // Show loading indicator while tasks are being hydrated from storage
  if (!isLoaded) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Task Manager</Text>
          <Text style={[styles.counter, { color: colors.textSecondary }]}>
            {activeCount} task{activeCount !== 1 ? 's' : ''} remaining
          </Text>
        </View>

        {/* Input */}
        <TaskInput onAddTask={addTask} />

        {/* Search */}
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

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
          onEdit={editTask}
          emptyComponent={<EmptyState filter={filter} searchQuery={searchQuery} />}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  counter: {
    fontSize: 14,
    marginTop: 4,
  },
});
