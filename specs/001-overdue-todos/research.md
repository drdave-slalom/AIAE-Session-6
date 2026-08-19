# Phase 0 Research: Support for Overdue Todo Items

All Technical Context items were resolvable from the existing codebase and spec; there are
no open `NEEDS CLARIFICATION` items. This document records the key decisions.

## Decision 1: Derive overdue state at view time (no persisted field)

- **Decision**: Compute overdue as a derived value at render time from the todo's
  `dueDate` and `completed` fields against the current local date. Do not add a stored
  column or API field.
- **Rationale**: FR-007 and the spec's assumptions require overdue to stay correct as the
  calendar advances without editing todos. A stored flag would go stale. Deriving keeps the
  backend and data model untouched (Constitution III — simplicity; scope discipline).
- **Alternatives considered**:
  - *Persisted `overdue` field updated on write*: rejected — becomes stale as dates pass,
    adds backend/schema work outside scope.
  - *Backend-computed field in API responses*: rejected — unnecessary coupling; the cue is
    purely presentational and the frontend already knows the current date.

## Decision 2: Date comparison semantics (calendar-date based)

- **Decision**: Compare calendar dates only (year/month/day) in the user's local timezone.
  A todo is overdue when `completed` is falsy AND `dueDate` is present AND the due
  calendar date is strictly before today's calendar date. Due today → not overdue.
- **Rationale**: FR-002 treats due-today as not overdue; the assumptions state overdue is
  date-based, not time-of-day based. Normalizing both dates to local midnight avoids
  timezone/time-of-day false positives.
- **Alternatives considered**:
  - *Timestamp (millisecond) comparison*: rejected — a due date stored as a date (e.g.
    `2026-08-18`) parses to UTC midnight and could misclassify near local midnight.
  - *UTC calendar comparison*: rejected — spec defines "current date" as the user's local
    calendar date.

## Decision 3: `completed` field shape

- **Decision**: Treat `completed` as truthy/falsy. The backend stores it as integer `0`/`1`
  and `TodoCard` already checks `todo.completed === 1`; the utility uses a truthy check so
  it is robust to `0/1`, `true/false`.
- **Rationale**: Existing code (`packages/frontend/src/components/TodoCard.js`) uses the
  `0/1` representation from the SQLite-backed API. A truthy guard matches current data and
  is defensive without over-engineering.
- **Alternatives considered**: strict `=== 1` only — rejected as slightly more brittle if a
  boolean is ever passed; a truthy check covers both.

## Decision 4: Visual indicator form (icon + aria-label + accent color)

- **Decision**: Render a warning icon (e.g. `⚠`) inside each overdue `TodoCard` with a
  descriptive `aria-label` (e.g. `Overdue`) and danger-color styling using the existing
  `--danger-color` design token.
- **Rationale**: FR-006 and SC-004 require the cue to be conveyed beyond color alone; the
  clarification session selected an icon with `aria-label` plus accent color. Reusing
  existing tokens preserves design-system fidelity (Constitution IV) and light/dark support.
- **Alternatives considered**:
  - *Color-only text/background*: rejected — fails non-color-dependency (FR-006).
  - *Text badge only ("Overdue")*: acceptable but the clarification specifically chose an
    icon; icon + accessible label satisfies both perception and accessibility.

## Decision 5: Recomputation strategy (no background timer)

- **Decision**: Recompute overdue on each render (list load and user interactions). Do not
  add a timer or midnight re-evaluation.
- **Rationale**: FR-007 and the clarification explicitly exclude a background timer; React
  recomputes derived values on each render, which naturally covers load and interactions.
- **Alternatives considered**: `setInterval`/midnight scheduler — rejected as out of scope
  and unnecessary complexity (Constitution III).

## Decision 6: Testing approach (deterministic current date)

- **Decision**: Unit-test `isOverdue` by passing an explicit "now"/reference date argument
  (defaulting to `new Date()`), and test `TodoCard` rendering with fixed dates.
- **Rationale**: Constitution II requires isolated, deterministic tests that mock timers.
  Injecting the reference date avoids flaky, clock-dependent tests and covers boundary cases
  (yesterday, today, tomorrow, no due date, completed).
- **Alternatives considered**: mocking global `Date` — workable but injecting the reference
  date is simpler and more explicit.

**Output**: All decisions resolved; ready for Phase 1 design.
