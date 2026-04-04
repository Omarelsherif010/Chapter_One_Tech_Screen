import { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutAnimation } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FilterType, PRIORITY_ORDER, Priority, Task } from '@/types/task';
import { generateId } from '@/utils/generateId';

const STORAGE_KEY = '@task_manager/tasks';

/** Custom hook encapsulating all task state, persistence, CRUD operations, filtering, and search */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load tasks from AsyncStorage on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: Task[] = JSON.parse(stored);
          // Defensive migration: ensure priority exists on all tasks
          const migrated = parsed.map((t) => ({
            ...t,
            priority: t.priority ?? ('medium' as Priority),
          }));
          setTasks(migrated);
        }
      } catch {
        // On parse failure, start fresh
      } finally {
        setIsLoaded(true);
      }
    };
    loadTasks();
  }, []);

  // Persist tasks to AsyncStorage on every change (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch(() => {
      // Silent fail — persistence is best-effort
    });
  }, [tasks, isLoaded]);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    // Apply filter tab
    if (filter === 'active') result = result.filter((t) => !t.completed);
    else if (filter === 'completed') result = result.filter((t) => t.completed);

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((t) => t.text.toLowerCase().includes(q));
    }

    // Sort: incomplete first by priority, then by date (newest first)
    return [...result].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.createdAt - a.createdAt;
    });
  }, [tasks, filter, searchQuery]);

  const activeCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);

  const addTask = useCallback((text: string, priority: Priority = 'medium') => {
    const newTask: Task = {
      id: generateId(),
      text,
      completed: false,
      createdAt: Date.now(),
      priority,
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const editTask = useCallback((id: string, newText: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, text: newText } : task))
    );
  }, []);

  return {
    tasks,
    filteredTasks,
    filter,
    searchQuery,
    isLoaded,
    activeCount,
    completedCount,
    totalCount: tasks.length,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    setFilter,
    setSearchQuery,
  };
}
