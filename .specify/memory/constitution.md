<!--
Sync Impact Report
Version change: (template, unversioned) → 1.0.0
Rationale: Initial ratification of the project constitution derived from the docs/ guidelines.
Modified principles: N/A (initial adoption)
Added sections:
  - Core Principles (5 principles)
    - I. Code Quality & Consistency
    - II. Test-First & Comprehensive Coverage
    - III. Simplicity & Scope Discipline
    - IV. Design System Fidelity & Accessibility
    - V. Reliable Persistence & Graceful Error Handling
  - Technology & Architecture Standards (SECTION_2)
  - Development Workflow & Quality Gates (SECTION_3)
  - Governance
Removed sections: None
Templates requiring updates:
  - .specify/memory/constitution.md ✅ updated
Follow-up TODOs: None
-->

# Copilot Bootcamp Todo App Constitution

## Core Principles

### I. Code Quality & Consistency

All code MUST follow the project coding standards without exception. Use 2-space
indentation, LF line endings, no trailing whitespace, and keep lines under 100
characters. Apply the naming conventions consistently: `camelCase` for variables and
functions, `UPPER_SNAKE_CASE` for constants, and `PascalCase` for React components and
classes, with file names matching component names. Imports MUST be grouped and ordered
(external libraries, internal modules, styles) with blank lines between groups. Code MUST
be DRY, KISS, and adhere to SOLID principles: every module, component, and function has a
single, well-defined responsibility. All ESLint errors and warnings MUST be resolved
before a pull request is opened, and no `console.log` statements may remain in production
code.

**Rationale**: Consistency and disciplined structure keep a shared codebase readable,
reviewable, and maintainable, and prevent avoidable defects from style drift.

### II. Test-First & Comprehensive Coverage

Tests MUST describe expected behavior and be written as part of development, following the
Red-Green-Refactor TDD cycle where practical. Tests MUST target behavior, not
implementation details, use descriptive names, and follow the Arrange-Act-Assert pattern.
Tests MUST be isolated: independent, self-contained, and mocking all external dependencies
(API calls, timers). The project MUST maintain 80%+ code coverage across all packages, with
100% coverage for critical user workflows. Test files are named `{filename}.test.js` and
colocated in `__tests__/` directories. All tests MUST pass before a pull request is created,
and bug fixes MUST include a test that reproduces the bug before it is fixed.

**Rationale**: Behavior-focused, isolated tests document intent, catch regressions early,
and give the team confidence to refactor safely.

### III. Simplicity & Scope Discipline

Features MUST stay within the defined functional scope: create, view, update, toggle
completion, and delete single-user todos with a title and optional due date. Out-of-scope
capabilities — authentication, multi-user support, priorities, categories, recurring todos,
reminders, undo/redo, bulk operations, search, and advanced filtering — MUST NOT be added
without a constitutional amendment. Prefer the simplest solution that satisfies the
requirement (YAGNI); avoid premature optimization and unnecessary abstraction. New
complexity MUST be justified against the requirement it serves.

**Rationale**: A tightly scoped, simple product is easier to build correctly, test, and
maintain, and prevents scope creep from eroding quality.

### IV. Design System Fidelity & Accessibility

The user interface MUST conform to the design system: the defined light/dark color
palettes, typography scale, and the 8px spacing grid. Layout MUST use the single-column,
max-600px structure with the specified header, inline input form, and todo list, including
the empty state. Both light and dark modes MUST be supported, defaulting to system
preference and persisting the user's choice in `localStorage`. Accessibility is
non-negotiable: all interactive elements MUST be keyboard accessible, color contrast MUST
meet WCAG AA, form labels MUST be associated with inputs, icon buttons MUST have descriptive
`aria-label`/titles, and focus indicators MUST be visible.

**Rationale**: A consistent, accessible interface delivers a usable, inclusive experience
and protects the intended visual identity of the product.

### V. Reliable Persistence & Graceful Error Handling

All todo changes (create, update, toggle, delete) MUST be persisted immediately to the
Express.js backend so state survives a page refresh. Destructive actions MUST require
confirmation before execution — deletion MUST show a confirmation dialog. Operations that
can fail MUST be wrapped in error handling that produces meaningful, actionable messages and
clear user feedback when something goes wrong. Input data MUST be validated at API
boundaries, using guard clauses and default values to prevent undefined-state errors.

**Rationale**: Durable persistence and graceful failure handling protect user data and
build trust that the application behaves predictably.

## Technology & Architecture Standards

The application is a monorepo managed with npm workspaces, split into
`packages/frontend/` (React + React DOM, CSS, Jest) and `packages/backend/`
(Node.js + Express.js, Jest). Node.js v16+ and npm v7+ are required. The frontend
communicates with the backend exclusively through the REST API; no database schema changes
beyond basic todo storage are permitted. Source code MUST follow the prescribed directory
structure — `components/`, `services/`, and `utils/` on the frontend and `routes/`,
`controllers/`, `services/`, and `middleware/` on the backend — with tests colocated in
`__tests__/` directories. Shared logic MUST be extracted into utilities rather than
duplicated across packages.

## Development Workflow & Quality Gates

Work MUST proceed on feature branches (e.g., `feature/todo-editing`) and merge via pull
requests that receive code review. Commits MUST be atomic, represent one logical change, and
carry clear messages explaining the "why". Before opening a pull request, contributors MUST
verify the Code Review Checklist: naming conventions followed, imports organized, no lint
errors or warnings, code is DRY with single-responsibility functions, error handling in
place, comments clear and purposeful, tests written and passing, commits atomic, and no
stray `console.log` statements. Run `npm test` (and coverage as needed) locally and ensure
all tests pass before requesting review.

## Governance

This constitution supersedes other ad-hoc practices for the project. Amendments MUST be
proposed via pull request, documented with rationale, and approved through code review
before taking effect; any change that expands or reduces scope defined in Principle III
requires explicit approval. Versioning follows semantic rules: MAJOR for backward-
incompatible governance or principle removals/redefinitions, MINOR for newly added or
materially expanded principles/sections, and PATCH for clarifications and non-semantic
refinements. All pull requests and reviews MUST verify compliance with these principles, and
any added complexity MUST be justified against the requirement it serves. Refer to the
documents in `docs/` for detailed runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-08-18 | **Last Amended**: 2026-08-18
