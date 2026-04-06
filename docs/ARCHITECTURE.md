# Architecture

## Overview

The Task Manager is a single-screen React Native app built with Expo and expo-router. It uses a custom `useTasks()` hook for all business logic, `ThemeContext` for dark mode, and AsyncStorage for persistence. Data flows unidirectionally from the hook through props to child components.

## Component Tree

```text
app/_layout.tsx
│   ThemeProvider (dark mode context)
│   GestureHandlerRootView (required for swipe gestures)
│   Stack navigator (headerShown: false)
│   ThemedStatusBar (adapts to light/dark)
│
└── app/index.tsx (TaskManagerScreen)
    │   Consumes: useTasks() hook, useTheme() hook
    │   Shows ActivityIndicator while isLoaded=false
    │
    ├── TaskInput
    │     Props: onAddTask(text, priority)
    │     Local state: inputText, priority
    │     Features: priority selector (H/M/L pills), shake animation
    │
    ├── SearchBar
    │     Props: value, onChangeText
    │     Features: clear button, search icon
    │
    ├── FilterTabs
    │     Props: filter, onFilterChange, taskCounts
    │     Pure component (no local state)
    │
    └── TaskList
          Props: tasks, onToggle, onDelete, onEdit, emptyComponent
          │
          ├── TaskItem (rendered per task via FlatList)
          │     Props: task, onToggle, onDelete, onEdit
          │     Local state: isEditing, editText
          │     Features: priority dot, checkbox, inline edit (long-press),
          │               swipe-to-delete, delete button, accessibility labels
          │
          └── EmptyState (via ListEmptyComponent)
                Props: filter, searchQuery
                Shows context-aware message (no tasks / no results / no active / no completed)
```

## Data Flow

```text
User Action            Hook (useTasks)              State Update              UI Update
──────────────────────────────────────────────────────────────────────────────────────────
Type + tap "Add"    →  addTask(text, priority)    →  prepend to tasks[]     →  list updates + haptic
Tap checkbox        →  toggleTask(id)             →  toggle completed       →  item restyled + haptic
Tap X / swipe       →  deleteTask(id)             →  Alert → filter out    →  list updates + haptic
Long-press text     →  (local TaskItem state)     →  isEditing=true        →  inline TextInput
Submit edit         →  editTask(id, newText)      →  update text           →  item re-renders
Tap filter tab      →  setFilter(filterType)      →  filteredTasks recomputes → list re-filters
Type in search      →  setSearchQuery(text)       →  filteredTasks recomputes → list re-filters
App launch          →  AsyncStorage.getItem()     →  setTasks(stored)      →  list populates
Any task mutation   →  AsyncStorage.setItem()     →  (persisted to disk)   →  (no UI change)
```

## useTasks() Hook (`hooks/useTasks.ts`)

The central piece of the architecture. Encapsulates:

| Concern | Implementation |
|---------|----------------|
| Task state | `useState<Task[]>` |
| Filter state | `useState<FilterType>` |
| Search state | `useState<string>` |
| Loading state | `useState<boolean>` (`isLoaded`) |
| Derived data | `useMemo` for `filteredTasks`, `activeCount`, `completedCount` |
| CRUD handlers | `useCallback` for `addTask`, `toggleTask`, `deleteTask`, `editTask` |
| Persistence | `useEffect` to load on mount, save on every mutation |
| Haptics | `expo-haptics` calls inside handlers |
| Delete confirm | `Alert.alert` inside `deleteTask` |
| Sorting | Priority-based (high→medium→low), completed last, newest first |

### AsyncStorage Guard Pattern

```text
Mount → loadTasks() → setTasks(stored) → setIsLoaded(true)
                                                    ↓
                                            Save effect now active
                                            (skips while isLoaded=false)
```

This prevents the initial empty `tasks=[]` from overwriting stored data before hydration completes.

## Dark Mode (`contexts/ThemeContext.tsx`)

- `ThemeProvider` wraps the app at the root layout level
- Uses React Native's `useColorScheme()` to detect system preference
- Provides `{ colors, isDark }` via `useTheme()` hook
- `LightColors` and `DarkColors` defined in `constants/Colors.ts` with matching keys
- Components use `useTheme()` + inline style overrides: `[styles.base, { backgroundColor: colors.surface }]`
- `StatusBar` style adapts via a `ThemedStatusBar` child component (can't call `useTheme()` in the provider itself)

## Data Model

```typescript
type Priority = 'high' | 'medium' | 'low';

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

interface Task {
  id: string;          // Generated via Date.now() + Math.random()
  text: string;        // User-provided description
  completed: boolean;  // Toggle state
  createdAt: number;   // Timestamp for ordering
  priority: Priority;  // Affects sort order and visual indicator
}

type FilterType = 'all' | 'active' | 'completed';
```

## Filtering + Search + Sort Pipeline

Applied in a single `useMemo` in the hook:

1. **Filter tab** — show all, only active, or only completed
2. **Search** — case-insensitive substring match on task text (within filtered results)
3. **Sort** — incomplete first (by priority, then newest), completed last (by newest)

Filter tab counts always show **unfiltered** totals so users see the full distribution regardless of search.

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Custom hook, not Context, for task state | Simpler than Context for single-screen app; demonstrates hooks expertise |
| Context for theming only | Theming is a cross-cutting UI concern needed by every component — legitimate Context use |
| AsyncStorage (not SQLite/MMKV) | Simplest persistence for a small dataset; included with Expo |
| `isLoaded` guard | Prevents data loss from race condition on mount |
| Haptics in the hook, not in components | Centralizes feedback logic; components stay pure UI |
| Alert.alert for delete confirm | Native dialog, no extra dependency, consistent with platform UX |
| Priority as required field | Avoids undefined checks; defaults to 'medium' at creation |
| Defensive migration on load | `priority ?? 'medium'` when loading stored tasks — forward-compatible schema |
| Swipeable disabled during edit | Prevents gesture conflict when editing task text inline |
| FlatList over ScrollView | Virtualized rendering, built-in empty state, proper list semantics |
| GestureHandlerRootView at root | Required for react-native-gesture-handler; placed at root so all screens can use gestures |
