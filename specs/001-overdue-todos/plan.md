# Implementation Plan: Support for Overdue Todo Items

**Branch**: `001-overdue-todos` | **Date**: 2026-08-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-overdue-todos/spec.md`

## Summary

Add a view-time visual distinction for overdue todos. A todo is overdue when it is
incomplete AND its due date is earlier than the current local calendar date. Todos due
today, in the future, without a due date, or already completed are never overdue. The
overdue state is derived at render time (not persisted) via a small shared frontend
utility, and surfaced on each `TodoCard` as a warning icon with a descriptive
`aria-label` plus danger-color styling (the existing `--danger-color` token), so the cue
is perceivable without relying on color alone. No backend, data model, or API changes are
required.

## Technical Context

**Language/Version**: JavaScript (ES2020+), React 18, Node.js v16+

**Primary Dependencies**: React, React DOM (frontend); Express.js, better-sqlite3 (backend, unchanged)

**Storage**: SQLite via backend (unchanged; overdue is derived, not stored)

**Testing**: Jest + React Testing Library (frontend), Jest (backend)

**Target Platform**: Modern browsers (web application)

**Project Type**: Web application (npm workspaces monorepo: `packages/frontend`, `packages/backend`)

**Performance Goals**: Overdue determination is O(1) per todo at render time; no measurable impact on list render for expected single-user list sizes

**Constraints**: Overdue must be recomputed on each load and user interaction (next render); no background timer. Cue must meet WCAG AA and not depend on color alone.

**Scale/Scope**: Single-user todo list; changes limited to the frontend (one new utility + `TodoCard` presentation + styles)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Code Quality & Consistency**: PASS — New logic is a single-responsibility utility
  (`isOverdue`) with camelCase naming, colocated tests, and grouped imports. No
  `console.log` in production code.
- **II. Test-First & Comprehensive Coverage**: PASS — Utility and updated `TodoCard`
  behavior covered by unit tests (boundary dates, completed, no due date, toggle). Targets
  behavior, mocks the current date deterministically. Maintains 80%+ coverage.
- **III. Simplicity & Scope Discipline**: PASS — Adds only the requested visual distinction.
  No sorting, filtering, notifications, or new persisted fields. Derived-at-view-time keeps
  it minimal (YAGNI).
- **IV. Design System Fidelity & Accessibility**: PASS — Uses the existing `--danger-color`
  design token, icon with descriptive `aria-label`, meets WCAG AA and non-color-dependency (FR-006/SC-004).
- **V. Reliable Persistence & Graceful Error Handling**: PASS — No new persistence path;
  existing create/update/toggle flows and confirmation dialogs are unchanged. Overdue
  computation uses guard clauses for missing/invalid due dates.

**Result**: PASS — No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todos/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── overdue-ui.md    # UI/behavior contract for the overdue indicator
├── checklists/
│   └── requirements.md  # Existing requirements checklist
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created here)
```

### Source Code (repository root)

```text
packages/frontend/
├── src/
│   ├── components/
│   │   ├── TodoCard.js                 # MODIFIED: render overdue icon + aria-label + danger styling
│   │   └── __tests__/
│   │       └── TodoCard.test.js        # MODIFIED: overdue rendering behavior tests
│   ├── utils/
│   │   ├── isOverdue.js                # NEW: derive overdue state from todo + current date
│   │   └── __tests__/
│   │       └── isOverdue.test.js        # NEW: boundary/edge-case unit tests
│   ├── styles/
│   │   └── theme.css                   # UNCHANGED: reuses the existing --danger-color token
│   └── App.css                         # MODIFIED: add .todo-card--overdue danger styling (light/dark, WCAG AA)
└── (backend unchanged)
```

**Structure Decision**: Web application monorepo. This feature is frontend-only. It adds a
shared `utils/isOverdue.js` (per the constitution's prescribed `utils/` directory) and
updates the `TodoCard` presentation and its styles (the `.todo-card--overdue` rule is added
to `App.css`, alongside the existing `.todo-card` rules, reusing the `--danger-color` token
from `theme.css`). The backend, API, and stored data model are unchanged because overdue is
a derived, view-time characteristic.

## Complexity Tracking

> No constitution violations — this section intentionally left empty.
