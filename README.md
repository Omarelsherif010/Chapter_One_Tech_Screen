# Task Manager - Chapter One Tech Screen

A simple and polished Task Manager app built with React Native and Expo.

## Features

- **Add Task** — Create tasks with a text description
- **Mark Complete** — Toggle tasks between active and completed (visual strikethrough + opacity change)
- **Delete Task** — Remove tasks via the delete button or swipe-to-delete gesture
- **Filter Tasks** — Switch between All, Active, and Done views with live counts
- **Animations** — Smooth layout animations on add/delete, shake animation on invalid input
- **Empty State** — Context-aware messages when no tasks match the current filter
- **Task Counter** — Live count of remaining tasks in the header

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

## Project Structure

```text
app/
├── _layout.tsx          # Root layout with gesture handler and status bar
└── index.tsx            # Main screen — owns all task state and handlers
components/
├── EmptyState.tsx       # Displayed when no tasks match the current filter
├── FilterTabs.tsx       # All / Active / Done filter buttons
├── TaskInput.tsx        # Text input with Add button and shake validation
├── TaskItem.tsx         # Task row with checkbox, swipe-to-delete, and delete icon
└── TaskList.tsx         # FlatList wrapper for rendering tasks
types/
└── task.ts              # Task interface and FilterType definitions
utils/
└── generateId.ts        # Unique ID generator (no external dependencies)
constants/
└── Colors.ts            # App color palette
```

## Tech Stack

- **React Native** with **Expo** (SDK 54)
- **TypeScript**
- **expo-router** — file-based routing
- **React Native Gesture Handler** — swipe-to-delete gesture
- **React Native Reanimated** — animation support

## Design Decisions

- **Local state only** — All task state is managed via `useState` in the root screen component, passed down via props. No external state management libraries.
- **Custom styling** — Built with React Native `StyleSheet` for full control and to demonstrate understanding of RN styling.
- **FlatList** — Used instead of ScrollView for virtualized rendering and proper list handling.
- **No external dependencies for IDs** — Using `Date.now() + Math.random()` instead of a UUID library to keep the dependency tree minimal.
