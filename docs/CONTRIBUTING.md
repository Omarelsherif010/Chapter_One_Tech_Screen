# Contributing

## Git Workflow

### Branch Strategy

- **`main`** is the stable branch. Never commit directly to main.
- Create a feature branch for every change:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### Branch Naming

| Prefix | Use Case | Example |
|--------|----------|---------|
| `feature/` | New features or enhancements | `feature/add-dark-mode` |
| `fix/` | Bug fixes | `fix/keyboard-overlap` |
| `docs/` | Documentation changes | `docs/add-architecture` |
| `refactor/` | Code refactoring (no behavior change) | `refactor/extract-hooks` |

### Commit Conventions

Write concise commit messages that explain **why**, not just **what**.

```text
<type>: <short description>

<optional body explaining context>
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `chore`

**Examples:**
```text
feat: add swipe-to-delete on task items
fix: prevent empty tasks from being created
docs: add architecture documentation
refactor: extract task filtering into useMemo
```

### Pre-Commit Checklist

Before every commit, verify:

1. **Lint passes:** `npx expo lint`
2. **No security issues:**
   - No hardcoded secrets, API keys, or tokens
   - No `dangerouslySetInnerHTML` or equivalent
   - User input is sanitized (trimmed) before use
   - No sensitive data in state or logs
3. **No bugs:**
   - Test the feature manually on a simulator/device
   - Check edge cases (empty input, rapid taps, long text)
   - Verify the app doesn't crash on load
4. **Code quality:**
   - No unused imports or variables
   - No `any` types
   - No `console.log` left in production code

### Pull Request Process

1. Push your feature branch:
   ```bash
   git push -u origin feature/your-feature-name
   ```
2. Open a PR against `main`
3. PR title should follow commit convention: `feat: add dark mode support`
4. Include in the PR description:
   - What changed and why
   - How to test it
   - Screenshots if UI changed

## Code Standards

### File Organization

- **Components** go in `components/` -- one component per file, named exports
- **Types** go in `types/` -- shared interfaces and type aliases
- **Utilities** go in `utils/` -- pure helper functions
- **Constants** go in `constants/` -- configuration values, color palette

### Component Guidelines

- Use **function components** with TypeScript
- Define **prop interfaces** directly above the component in the same file
- Use **named exports** (not default exports) for components
- Only `app/` route files use default exports (required by expo-router)
- Keep components focused: if a component does too much, split it

### Styling

- Use `StyleSheet.create()` at the bottom of each component file
- Reference colors from `constants/Colors.ts` -- never hardcode color values
- Use the spacing scale: multiples of 4 (4, 8, 12, 16, 20, 24, 32)

### State Management

- All task state lives in `app/index.tsx`
- Child components receive data and callbacks via props
- Use `useCallback` for handlers passed as props
- Use `useMemo` for derived/computed values
- Use functional updates for state: `setTasks(prev => ...)`

## Development Commands

```bash
npx expo start          # Start dev server
npx expo start --ios    # Run on iOS simulator
npx expo start --android # Run on Android emulator
npx expo lint           # Run ESLint
```
