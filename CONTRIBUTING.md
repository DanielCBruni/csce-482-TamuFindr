# Contributing

## Branch architecture:

    main     : Live branch, contains deployed code
    /\
    testing   : Integration branch, finished features get pushed here for testing/connecting, pushed up when all code is functional and clean
    /\
    wip     : Initial development branch, all individual features created here and pushed upward

## Code Standards

This project uses:

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for consistent formatting

To automatically format your code:

```bash
pnpm format
```

Before submitting changes, run:

```bash
pnpm check
pnpm build
```

Use 2-space indentation and follow the existing project structure and naming conventions.

Install the **Prettier - Code formatter** VS Code extention. Save changes to automatically format your code.

## Branches

Create a separate branch for your work.

Examples:

```text
feature/lost-item-form
feature/search
fix/form-validation
```

Keep branches focused on one feature or fix.

## Commits

Use short, descriptive commit messages.

Examples:

```text
Add lost item submission form
Fix search filter validation
Update item card styling
```

## Pull Requests

Before opening a pull request:

- Make sure the project builds and runs locally.
- Run ESLint and Prettier checks.
- Test the functionality you changed.
- Remove unused code, debug logs, and temporary files.
- Keep the pull request focused on one feature or issue.
