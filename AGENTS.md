# Repository Guidelines

## Project Structure & Module Organization

`src/app/` contains standalone Angular features, with `features/` for domain flows, `layout/` for shells, and `core/` or `services/` for shared providers. Shared presentational pieces live in `components/`. Global styles and design tokens are in `src/styles/`, while Storybook references stay in `src/stories/`. Static assets stay in `public/`; builds write to `dist/`, coverage to `coverage/`, Playwright specs to `tests/`.

## Build, Test, and Development Commands

`npm start` launches the Angular dev server with proxy support. `npm run build` emits an optimized bundle in `dist/`. `npm test` runs the Vitest-powered Angular CLI target. `npm run coverage` gathers V8 coverage and writes `coverage/lcov-report/index.html`. `npm run lint` applies ESLint + angular-eslint, and `npm run prettier` formats the workspace. Storybook lives under `npm run storybook`; use `npm run build-storybook` before publishing component docs.

## Coding Style & Naming Conventions

Linting forbids `any` and enforces `app` selectors (`app-widget`, `appWidget`). Follow Angular standalone patterns, colocate template and style files, and keep Tailwind utility-first styling unless a CSS file grows past lightweight tweaks. Prettier is configured for two-space indentation, 100-character lines, and single quotes. Watch for files under `src/app/core/openapi/**`; they are generated and must remain untouched.

## Testing Guidelines

Place unit specs beside their implementation and prefer Testing Library-style assertions. Run suites with `npm test`; execute `npm run coverage` before merging to ensure coverage does not regress. Browser automation belongs in Playwright under `tests/`; command `npx playwright test` (install browsers once via `npx playwright install`). Keep tests deterministic and isolate network traffic with spies or mock services.

## Agent Workflow Essentials

Start every request by clarifying whether it is a TASK (code change) or QUERY (exploration). For TASKs, confirm a GitHub issue exists; create one if missing, record acceptance criteria, and get user approval before implementation. Always consult the Angular Best Practices MCP helper before coding. Branch from an updated `master` using the `type/description` naming convention (e.g., `feature/navbar-signout`). Run Prettier, lint, unit tests, and Storybook updates before handing work back. Never edit generated OpenAPI files.

## Storybook Guidelines

- Use the shared helpers (`createLightDarkComparison`, `wrapInLightDarkComparison`, `createVariantComparison`) for every Light/Dark presentation. Avoid hand-crafted duplicated markup or decorators that toggle dark mode manually.
- When a story needs to show several components together, wrap the whole block with `wrapInLightDarkComparison` instead of reimplementing the comparison layout.
- Mock every service dependency that hits `HttpClient` (e.g., `AuthService`, `UserApiService`) inside the story decorators so Storybook doesn’t crash while instantiating components.
- Keep helpers style-agnostic: they should only wrap the content; any visual tweaks belong in the components or design tokens.

## Commit & Pull Request Guidelines

Commits follow Conventional Commit syntax (`feat:`, `fix:`, `docs:`) with concise imperative subjects and optional scopes (`feat(navbar): add sign-out`). Each PR must link its issue, summarize the solution, call out risks, and attach UI screenshots or Storybook links when visual changes occur. Ensure automated checks pass, document any manual verification, and highlight follow-up tasks when relevant.
