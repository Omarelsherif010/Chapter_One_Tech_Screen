# Task Manager - Chapter One Tech Screen

A polished Task Manager app built with React Native and Expo, featuring persistent storage, dark mode, task priorities, search, inline editing, and haptic feedback.

## Features

### Core Features (Required)
- **Add Task** — Create tasks with a text description and priority level
- **Mark Complete** — Toggle tasks between active and completed (visual strikethrough + opacity change)
- **Delete Task** — Remove tasks via the delete button or swipe-to-delete gesture, with confirmation dialog
- **Task List** — FlatList displaying all tasks, sorted by priority and completion status

### Extra Features (Beyond Requirements)
- **Persistent Storage** — Tasks are saved to device storage via AsyncStorage and survive app restarts
- **Dark Mode** — Automatic system theme detection with full light/dark color palettes
- **Task Priority** — High/Medium/Low priority with colored indicators (red/orange/green) and priority-based sorting
- **Search** — Search bar to filter tasks by text, works in combination with filter tabs
- **Inline Edit** — Long-press a task to edit its text inline
- **Filter Tabs** — Switch between All, Active, and Done views with live counts
- **Haptic Feedback** — Tactile vibrations on add, complete, and delete actions
- **Delete Confirmation** — Alert dialog prevents accidental task deletion
- **Animations** — Smooth layout animations on add/delete, shake animation on invalid input
- **Empty State** — Context-aware messages when no tasks match the current filter or search
- **Task Counter** — Live count of remaining tasks in the header
- **Accessibility** — Screen reader support with proper roles, states, and labels

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Expo Go](https://expo.dev/go) app on your phone (for physical device testing)

### Setup

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

Then:
- **iOS Simulator:** Press `i` in the terminal
- **Android Emulator:** Press `a` in the terminal
- **Physical Device:** Scan the QR code with Expo Go

## Usage Guide

| Action | How |
|--------|-----|
| Add a task | Type in the input field, select priority (H/M/L), tap "Add" |
| Complete a task | Tap the circular checkbox |
| Delete a task | Tap the "X" button or swipe left, then confirm |
| Edit a task | Long-press the task text to enter inline edit mode |
| Search tasks | Type in the search bar below the input |
| Filter tasks | Tap All / Active / Done tabs |
| Change priority | Tap H/M/L colored pills before adding a task |

## Project Structure

```text
app/
├── _layout.tsx              # Root layout: ThemeProvider, gesture handler, status bar
└── index.tsx                # Main screen — consumes useTasks() hook
hooks/
└── useTasks.ts              # Custom hook: all task state, CRUD, persistence, search, haptics
contexts/
└── ThemeContext.tsx          # ThemeProvider + useTheme() for dark mode
components/
├── EmptyState.tsx           # Displayed when no tasks match filter/search
├── FilterTabs.tsx           # All / Active / Done filter buttons with counts
├── SearchBar.tsx            # Search input with clear button
├── TaskInput.tsx            # Text input + priority selector + Add button
├── TaskItem.tsx             # Task row: priority dot, checkbox, inline edit, swipe-to-delete
└── TaskList.tsx             # FlatList wrapper for rendering tasks
types/
└── task.ts                  # Task interface, Priority type, FilterType
utils/
└── generateId.ts            # Unique ID generator (no external dependencies)
constants/
└── Colors.ts                # Light/Dark color palettes with priority colors
docs/
├── ARCHITECTURE.md          # Component tree, data flow, design decisions
├── COMPONENTS.md            # Full component API reference
└── CONTRIBUTING.md          # Git workflow, code standards, commit conventions
```

## Tech Stack

- **React Native** with **Expo** (SDK 54)
- **TypeScript** — strict mode enabled
- **expo-router** — file-based routing
- **React Native Gesture Handler** — swipe-to-delete gesture
- **React Native Reanimated** — animation support
- **@react-native-async-storage/async-storage** — persistent task storage
- **expo-haptics** — tactile feedback on interactions

## Design Decisions

- **Custom `useTasks()` hook** — All task state, CRUD operations, persistence, filtering, sorting, haptics, and delete confirmation encapsulated in one hook. The main screen is a thin UI shell.
- **ThemeContext for dark mode** — React Context provides system-aware colors to all components. This is a cross-cutting UI concern, separate from task state management.
- **AsyncStorage with `isLoaded` guard** — Tasks persist across restarts. A loading guard prevents overwriting stored data with empty initial state during hydration.
- **Custom styling** — Built with React Native `StyleSheet` for full control and to demonstrate understanding of RN styling. No UI library dependencies.
- **FlatList** — Used instead of ScrollView for virtualized rendering and proper list handling.
- **Priority sorting** — Incomplete tasks sorted by priority (high first), then by date. Completed tasks sink to the bottom.
- **No UUID library** — Using `Date.now() + Math.random()` to keep the dependency tree minimal.
- **Accessibility first** — Checkbox and delete controls have proper `accessibilityRole`, `accessibilityState`, and `accessibilityLabel` for screen reader support.
