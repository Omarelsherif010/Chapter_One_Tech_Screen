# Component Reference

## TaskInput

**File:** `components/TaskInput.tsx`

Text input with priority selector and Add button for creating new tasks. Includes input validation and shake animation feedback.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `onAddTask` | `(text: string, priority: Priority) => void` | Called with trimmed text and selected priority when a valid task is submitted |

### Internal State

| State | Type | Description |
|-------|------|-------------|
| `inputText` | `string` | Current value of the text input |
| `priority` | `Priority` | Selected priority level (defaults to `'medium'`) |

### Behavior

- Trims whitespace before submission
- **Empty input:** Triggers a shake animation (4-step `translateX` sequence) and does not call `onAddTask`
- **Valid input:** Calls `onAddTask(trimmedText, priority)`, clears input, resets priority to medium, dismisses keyboard
- **Add button:** Visually disabled (grayed out) when input is empty
- **Priority selector:** Three colored pills (H/M/L) below the input — red for high, orange for medium, green for low. Selected pill is filled, others show border only. Uses `accessibilityRole="radio"` with proper labels.

---

## TaskItem

**File:** `components/TaskItem.tsx`

A single task row displaying a priority dot, checkbox, task text (with inline edit), and delete affordances.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `task` | `Task` | The task object to render |
| `onToggle` | `(id: string) => void` | Called when the checkbox is tapped |
| `onDelete` | `(id: string) => void` | Called when the delete button or swipe action is triggered |
| `onEdit` | `(id: string, newText: string) => void` | Called when an inline edit is saved |

### Internal State

| State | Type | Description |
|-------|------|-------------|
| `isEditing` | `boolean` | Whether the task is in inline edit mode |
| `editText` | `string` | Current value of the edit input |

### Behavior

- **Priority dot:** 8x8 colored circle (red/orange/green) to the left of the checkbox
- **Checkbox:** Circular, toggles between empty (border only) and filled (blue + checkmark). Has `accessibilityRole="checkbox"` with state and label.
- **Completed state:** Text gets `line-through` decoration, reduced opacity (0.7), and muted color
- **Inline edit:** Long-press task text to enter edit mode. Text is replaced by a focused `TextInput`. Save on submit/blur. Empty edits revert to original text.
- **Delete button (always visible):** "X" icon on the right side of the row. Has `accessibilityRole="button"` with label.
- **Swipe-to-delete:** Swiping left reveals a red "Delete" button via `Swipeable`. Threshold: 40px. Disabled during edit mode to prevent gesture conflicts.

---

## TaskList

**File:** `components/TaskList.tsx`

Renders tasks in a virtualized scrollable list using `FlatList`.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `tasks` | `Task[]` | Array of tasks to display (already filtered and sorted) |
| `onToggle` | `(id: string) => void` | Passed through to each TaskItem |
| `onDelete` | `(id: string) => void` | Passed through to each TaskItem |
| `onEdit` | `(id: string, newText: string) => void` | Passed through to each TaskItem |
| `emptyComponent` | `React.ReactElement` | Rendered when `tasks` is empty (via `ListEmptyComponent`) |

### Behavior

- Uses `FlatList` with virtualized rendering
- `keyExtractor` uses `task.id` for stable keys
- `renderItem` and `keyExtractor` wrapped in `useCallback` to prevent unnecessary re-renders
- 8px separator between items via `ItemSeparatorComponent`
- Hides vertical scroll indicator

---

## SearchBar

**File:** `components/SearchBar.tsx`

Search input with clear button for filtering tasks by text.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | `string` | Current search query |
| `onChangeText` | `(text: string) => void` | Called on every keystroke |

### Behavior

- Magnifying glass icon on the left
- Clear ("X") button appears only when text is non-empty. Has `accessibilityRole="button"` with label.
- `autoCorrect={false}` for better search UX
- Theme-aware colors via `useTheme()`

---

## FilterTabs

**File:** `components/FilterTabs.tsx`

Horizontal row of three filter buttons with live task counts.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `filter` | `FilterType` | Currently active filter |
| `onFilterChange` | `(filter: FilterType) => void` | Called when a tab is tapped |
| `taskCounts` | `{ all: number; active: number; completed: number }` | Count for each filter (unfiltered by search) |

### Behavior

- Renders three pill-shaped buttons: **All**, **Active**, **Done**
- Each shows label and count: e.g., "Active (3)"
- Active tab has highlighted background and border
- Pure component: no internal state, fully controlled by props

---

## EmptyState

**File:** `components/EmptyState.tsx`

Displayed when no tasks match the current filter or search.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `filter` | `FilterType` | Current filter, used to select the appropriate message |
| `searchQuery` | `string` (optional) | If provided and non-empty, shows search-specific message |

### Messages

| Condition | Icon | Message |
|-----------|------|---------|
| Search active | Magnifying glass | "No tasks match your search." |
| Filter: all | Clipboard | "No tasks yet. Add one above!" |
| Filter: active | Clipboard | "No active tasks. Great job!" |
| Filter: completed | Clipboard | "No completed tasks yet." |

---

## Shared Types

**File:** `types/task.ts`

```typescript
type Priority = 'high' | 'medium' | 'low';

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority: Priority;
}

type FilterType = 'all' | 'active' | 'completed';
```

---

## Custom Hook

### useTasks (`hooks/useTasks.ts`)

Encapsulates all task business logic. See [ARCHITECTURE.md](ARCHITECTURE.md) for full details.

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `tasks` | `Task[]` | Raw task list |
| `filteredTasks` | `Task[]` | Filtered + searched + sorted tasks |
| `filter` | `FilterType` | Active filter tab |
| `searchQuery` | `string` | Current search text |
| `isLoaded` | `boolean` | Whether AsyncStorage hydration is complete |
| `activeCount` | `number` | Incomplete task count |
| `completedCount` | `number` | Completed task count |
| `totalCount` | `number` | Total task count |
| `addTask` | `(text, priority?) => void` | Add a task (triggers haptic) |
| `toggleTask` | `(id) => void` | Toggle completion (triggers haptic) |
| `deleteTask` | `(id) => void` | Delete with confirmation dialog (triggers haptic) |
| `editTask` | `(id, newText) => void` | Update task text |
| `setFilter` | `(filter) => void` | Change active filter tab |
| `setSearchQuery` | `(query) => void` | Update search text |

---

## Theme Hook

### useTheme (`contexts/ThemeContext.tsx`)

Provides theme colors based on system appearance.

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `colors` | `ThemeColors` | Color palette for the current theme |
| `isDark` | `boolean` | Whether dark mode is active |

---

## Color Palette

**File:** `constants/Colors.ts`

Both `LightColors` and `DarkColors` share the same keys:

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `primary` | `#4A90D9` | `#5B9FE6` | Accent, active filter, checkbox fill |
| `primaryLight` | `#EBF2FC` | `#1A2A3E` | Active filter tab background |
| `background` | `#F8F9FA` | `#121212` | Screen background |
| `surface` | `#FFFFFF` | `#1E1E1E` | Card/input backgrounds |
| `textPrimary` | `#1A1A2E` | `#E8E8E8` | Main text |
| `textSecondary` | `#6C757D` | `#9E9E9E` | Counter, muted text |
| `danger` | `#E74C3C` | `#EF5350` | Delete action |
| `priorityHigh` | `#E74C3C` | `#EF5350` | High priority indicator |
| `priorityMedium` | `#F39C12` | `#FFB74D` | Medium priority indicator |
| `priorityLow` | `#27AE60` | `#66BB6A` | Low priority indicator |
