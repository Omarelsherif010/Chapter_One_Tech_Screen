# Architecture

## Overview

The Task Manager is a single-screen React Native app built with Expo and expo-router. It follows a top-down unidirectional data flow: all state lives in the root screen component and flows down to child components via props.

## Component Tree

```
app/_layout.tsx
│   GestureHandlerRootView (required for swipe gestures)
│   Stack navigator (headerShown: false)
│   StatusBar
│
└── app/index.tsx (TaskManagerScreen)
    │   State: tasks[], filter
    │   Derived: filteredTasks, activeCount, completedCount
    │   Handlers: handleAddTask, handleToggleTask, handleDeleteTask
    │
    ├── TaskInput
    │     Props: onAddTask
    │     Local state: inputText
    │     Animations: shake on invalid submit
    │
    ├── FilterTabs
    │     Props: filter, onFilterChange, taskCounts
    │     Pure component (no local state)
    │
    └── TaskList
          Props: tasks, onToggle, onDelete, emptyComponent
          │
          ├── TaskItem (rendered per task via FlatList)
          │     Props: task, onToggle, onDelete
          │     Features: checkbox toggle, swipe-to-delete, delete button
          │
          └── EmptyState (via ListEmptyComponent)
                Props: filter
                Shows context-aware message
```

## Data Flow

```
User Action          Handler (index.tsx)         State Update           Re-render
───────────────────────────────────────────────────────────────────────────────────
Type + tap "Add"  →  handleAddTask(text)      →  prepend to tasks[]  →  TaskList updates
Tap checkbox      →  handleToggleTask(id)     →  toggle completed    →  TaskItem restyled
Tap ✕ / swipe     →  handleDeleteTask(id)     →  filter out by id   →  TaskList updates
Tap filter tab    →  setFilter(filterType)    →  filteredTasks       →  TaskList re-filters
```

All state mutations happen via functional updates (`setTasks(prev => ...)`) to avoid stale state issues with rapid interactions.

## Data Model

```typescript
interface Task {
  id: string;          // Generated via Date.now() + Math.random()
  text: string;        // User-provided description
  completed: boolean;  // Toggle state
  createdAt: number;   // Timestamp for ordering
}

type FilterType = 'all' | 'active' | 'completed';
```

## State Management Strategy

- **No external state libraries.** All state is managed via `useState` in `app/index.tsx`.
- **Derived values** (`filteredTasks`, `activeCount`, `completedCount`) are computed with `useMemo` to avoid unnecessary recalculations.
- **Handlers** are wrapped in `useCallback` to maintain referential equality and prevent unnecessary child re-renders.
- **FlatList** uses `useCallback` for `renderItem` and `keyExtractor` for the same reason.

## Animations

Two animation strategies are used:

1. **LayoutAnimation** (list transitions) -- Called via `LayoutAnimation.configureNext()` before every `setTasks` call that adds or removes items. This provides automatic smooth transitions for list changes. On Android, requires `UIManager.setLayoutAnimationEnabledExperimental(true)` in `_layout.tsx`.

2. **Animated API** (input shake) -- A `translateX` animation sequence in `TaskInput` that triggers when the user tries to submit an empty task. Uses `useNativeDriver: true` for performance.

## Routing

expo-router provides file-based routing, but this is a single-screen app:

- `app/_layout.tsx` -- Root layout (Stack navigator, gesture handler wrapper)
- `app/index.tsx` -- The only screen

The `(tabs)` layout from the default template was removed since the app has a single screen.

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| State in root only | Simple prop drilling works for a small component tree; demonstrates state/props fundamentals |
| FlatList over ScrollView | Virtualized rendering, proper list semantics, built-in empty state support |
| Swipeable + delete button | Two delete affordances: gesture-based (polished) and button (discoverable) |
| No UUID library | `Date.now() + Math.random()` is sufficient for local-only state with no persistence |
| Custom StyleSheet | Demonstrates understanding of RN styling without hiding it behind a library |
| GestureHandlerRootView in layout | Required for react-native-gesture-handler; placed at root to ensure all screens can use gestures |
