# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Task Manager app built as a tech screen for Chapter One. The app allows users to add tasks, mark them as complete, and delete them. The assessment PDF is in `docs/`.

## Tech Stack

- React Native with Expo
- Local component state only (useState) — no Redux, Context API, or external storage

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
- **Component-based structure**: separate components for task input, individual task items, and task list
- **State lives at the top level** — tasks array managed via `useState` in the root/app component, passed down via props
- **FlatList** for rendering the task list (not ScrollView)

## Assessment Requirements

The app is evaluated on four criteria:
1. **Functionality** — add, complete, delete tasks all work
2. **Code Quality** — clean, organized, commented where needed
3. **UI/UX** — intuitive interface with visual feedback (e.g., strikethrough/opacity for completed tasks)
4. **Core Concepts** — proper use of React Native components, state, and props
