# Contributing

## Development Workflow

Tamufindr uses the following branch flow:

```txt
  wip     : Active development integration
   |
   v
testing   : Integration and final testing before release
   |
   v
 main     : Live branch. Deployed, stable code
```

Create feature and fix branches from `wip`.

Examples:

```txt
feature/lost-item-form
feature/search
fix/form-validation
```

Keep branches focused on one feature or fix.

## Code Standards

This project uses:

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for consistent formatting

Use 2-space indentation and follow the existing project structure and naming conventions.

To automatically format your code:

```bash
pnpm format
```

Before submitting changes:

```bash
pnpm check
pnpm build
```

Install the **Prettier - Code formatter** VS Code extention. Save changes to automatically format your code.

## Commits

Use short, descriptive commit messages.

## Pull Requests

Before opening a pull request:

* Make sure the application builds and runs locally.
* Run pnpm check.
* Run pnpm build.
