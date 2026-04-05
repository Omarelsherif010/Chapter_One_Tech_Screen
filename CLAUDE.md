# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Task Manager app built as a tech screen for Chapter One. The app allows users to add tasks, mark them as complete, and delete them. The assessment PDF is in `docs/`.

## Tech Stack

- React Native with Expo (SDK 54), TypeScript, expo-router
- Task state managed via `useTasks()` custom hook (useState internally), persisted with AsyncStorage
- Theme managed via React Context (`ThemeProvider` / `useTheme()`) for dark mode support
- No Redux or external state management libraries

## Common Commands

```bash
# Install dependencies
npx create-expo-app@latest .    # Initial project setup (already done if app exists)
npm install

# Development
npx expo start                  # Start Expo dev server
npx expo start --ios            # Run on iOS simulator
npx expo start --android        # Run on Android emulator

# Linting
npx expo lint

# Type checking
npx tsc --noEmit
```

## Architecture

- **Expo-managed workflow** — no native code ejection
- **Custom hook (`useTasks`)** — all task state, CRUD, persistence, filtering, sorting, haptics, and delete confirmation in `hooks/useTasks.ts`
- **ThemeContext** — `contexts/ThemeContext.tsx` provides system-aware dark/light colors to all components via `useTheme()`
- **Component-based structure** — separate components for task input, items, list, search, filters, and empty state
- **FlatList** for rendering the task list (not ScrollView)
- **AsyncStorage** — tasks persist across app restarts with `isLoaded` guard to prevent data loss on mount

## Assessment Requirements

The app is evaluated on four criteria:
1. **Functionality** — add, complete, delete tasks all work
2. **Code Quality** — clean, organized, commented where needed
3. **UI/UX** — intuitive interface with visual feedback (e.g., strikethrough/opacity for completed tasks)
4. **Core Concepts** — proper use of React Native components, state, and props
