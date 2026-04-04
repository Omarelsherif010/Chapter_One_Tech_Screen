# Component Reference

## TaskInput

**File:** `components/TaskInput.tsx`

Text input with an Add button for creating new tasks. Includes input validation and shake animation feedback.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `onAddTask` | `(text: string) => void` | Called with the trimmed text when a valid task is submitted |

### Internal State

| State | Type | Description |
|-------|------|-------------|
| `inputText` | `string` | Current value of the text input |

### Behavior

- Trims whitespace before submission
- **Empty input:** Triggers a shake animation (4-step `translateX` sequence) and does not call `onAddTask`
- **Valid input:** Calls `onAddTask(trimmedText)`, clears the input, dismisses the keyboard
- **Add button:** Visually disabled (grayed out) when input is empty
- **Keyboard submit:** Pressing "Done" on the keyboard triggers the same submit logic

---

## TaskItem

**File:** `components/TaskItem.tsx`

A single task row displaying a checkbox, task text, and delete affordances.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `task` | `Task` | The task object to render |
| `onToggle` | `(id: string) => void` | Called when the checkbox is tapped |
| `onDelete` | `(id: string) => void` | Called when the delete button or swipe action is triggered |

### Behavior

- **Checkbox:** Circular, toggles between empty (border only) and filled (blue background + checkmark)
- **Completed state:** Text gets `line-through` decoration, reduced opacity (0.7), and muted color
- **Delete button (always visible):** "X" icon on the right side of the row
- **Swipe-to-delete:** Swiping left reveals a red "Delete" button. Uses `Swipeable` from `react-native-gesture-handler`. Threshold: 40px. Does not overshoot.
- **Touch targets:** Checkbox and delete button have padding/hitSlop for comfortable tapping

---

## TaskList

**File:** `components/TaskList.tsx`

Renders tasks in a virtualized scrollable list using `FlatList`.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `tasks` | `Task[]` | Array of tasks to display (already filtered) |
| `onToggle` | `(id: string) => void` | Passed through to each TaskItem |
| `onDelete` | `(id: string) => void` | Passed through to each TaskItem |
| `emptyComponent` | `React.ReactElement` | Rendered when `tasks` is empty (via `ListEmptyComponent`) |

### Behavior

- Uses `FlatList` with virtualized rendering
- `keyExtractor` uses `task.id` for stable keys
- `renderItem` and `keyExtractor` wrapped in `useCallback` to prevent unnecessary re-renders
- 8px separator between items via `ItemSeparatorComponent`
- Hides vertical scroll indicator
- When empty, the container uses `flexGrow: 1` so the empty state can center vertically

---

## FilterTabs

**File:** `components/FilterTabs.tsx`

Horizontal row of three filter buttons with live task counts.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `filter` | `FilterType` | Currently active filter (`'all'`, `'active'`, or `'completed'`) |
| `onFilterChange` | `(filter: FilterType) => void` | Called when a tab is tapped |
| `taskCounts` | `{ all: number; active: number; completed: number }` | Count for each filter |

### Behavior

- Renders three pill-shaped buttons: **All**, **Active**, **Done**
- Each button shows its label and count: e.g., "Active (3)"
- Active tab has blue background (`primaryLight`) and blue border/text
- Inactive tabs have white background with gray border/text
- Pure component: no internal state, fully controlled by props

### Filter Config

Defined as a static array:
```typescript
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Done' },
];
```

---

## EmptyState

**File:** `components/EmptyState.tsx`

Displayed when no tasks match the current filter.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `filter` | `FilterType` | Current filter, used to select the appropriate message |

### Messages

| Filter | Message |
|--------|---------|
| `all` | "No tasks yet. Add one above!" |
| `active` | "No active tasks. Great job!" |
| `completed` | "No completed tasks yet." |

### Visual

- Centered layout with vertical padding (60px)
- Clipboard emoji (48px) above the message text
- Muted gray text color

---

## Shared Types

**File:** `types/task.ts`

```typescript
interface Task {
  id: string;          // Unique identifier
  text: string;        // Task description
  completed: boolean;  // Completion status
  createdAt: number;   // Unix timestamp
}

type FilterType = 'all' | 'active' | 'completed';
```

---

## Utility Functions

### generateId

**File:** `utils/generateId.ts`

```typescript
generateId(): string
```

Returns a unique string ID using `Date.now()` combined with a random base-36 suffix. No external dependencies.

**Example output:** `"1712345678901-k3x9f2a"`

---

## Color Palette

**File:** `constants/Colors.ts`

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#4A90D9` | Buttons, active filter, checkbox fill |
| `primaryLight` | `#EBF2FC` | Active filter tab background |
| `background` | `#F8F9FA` | Screen background |
| `surface` | `#FFFFFF` | Card/input backgrounds |
| `textPrimary` | `#1A1A2E` | Main text |
| `textSecondary` | `#6C757D` | Counter, muted text, delete icon |
| `textCompleted` | `#ADB5BD` | Completed task text |
| `danger` | `#E74C3C` | Delete swipe action |
| `dangerLight` | `#FDEDEC` | (Available for delete hover states) |
| `success` | `#27AE60` | (Available for success indicators) |
| `border` | `#E9ECEF` | Checkbox border, disabled button |
| `separator` | `#F1F3F5` | (Available for list separators) |
| `inputBackground` | `#FFFFFF` | (Available for input fields) |
| `inputBorder` | `#DEE2E6` | Input container border |
| `inputPlaceholder` | `#ADB5BD` | Placeholder text color |
