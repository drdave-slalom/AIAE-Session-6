# UI Contract: Overdue Todo Indicator

This feature exposes no new backend/API surface. Its contract is the **frontend UI and the
derived-logic utility**. This document defines the observable behavior that tests and
implementation MUST satisfy.

## Utility contract: `isOverdue(todo, now = new Date())`

**Location**: `packages/frontend/src/utils/isOverdue.js`

**Signature**: `isOverdue(todo: Todo, now?: Date): boolean`

**Inputs**:

- `todo`: an object with `dueDate` (`string | null`) and `completed` (`0 | 1 | boolean`).
- `now` (optional): reference date; defaults to the current date. Injectable for testing.

**Returns**: `boolean` — `true` only when the todo is overdue.

**Behavior table**:

| # | `completed` | `dueDate` (relative to `now`) | Result  | Requirement |
|---|-------------|-------------------------------|---------|-------------|
| 1 | falsy       | before today                  | `true`  | FR-001      |
| 2 | falsy       | today                         | `false` | FR-002      |
| 3 | falsy       | after today                   | `false` | FR-001      |
| 4 | falsy       | null / empty                  | `false` | FR-003      |
| 5 | truthy      | before today                  | `false` | FR-004      |
| 6 | truthy      | today / after / null          | `false` | FR-004      |
| 7 | any         | invalid/unparseable string    | `false` | FR-003 (guard) |
| 8 | falsy       | `todo` is null/undefined      | `false` | guard clause |

**Guarantees**:

- Pure function: no side effects, no reliance on module-level mutable state.
- Compares local calendar dates only (time-of-day ignored).

## Component contract: `TodoCard` overdue presentation

**Location**: `packages/frontend/src/components/TodoCard.js`

When `isOverdue(todo)` is `true`, the rendered card MUST:

1. Display a warning icon (e.g. `⚠`) within the card.
2. Provide a descriptive accessible name for the indicator via `aria-label`
   (e.g. `aria-label="Overdue"`), so screen readers announce the state (FR-006).
3. Apply accent/danger-color styling via existing design tokens (`--danger-color` /
   `--color-accent`) using a CSS class (e.g. `todo-card--overdue`), supporting light/dark
   themes and WCAG AA contrast (FR-005, FR-006, SC-004).

When `isOverdue(todo)` is `false`, the card MUST NOT render the overdue icon or apply the
overdue styling class.

**Non-goals** (explicitly out of scope, per spec Assumptions):

- No sorting, filtering, grouping, or notifications based on overdue state.
- No changes to create/edit/toggle/delete API calls or payloads.
- No new persisted field or backend response field.

## Acceptance mapping

| Spec acceptance scenario                          | Verified by                          |
|---------------------------------------------------|--------------------------------------|
| US1 #1 incomplete + past due → overdue            | Utility row 1 + `TodoCard` renders icon |
| US1 #2 incomplete + due today → not overdue       | Utility row 2 + no icon              |
| US1 #3 incomplete + future due → not overdue      | Utility row 3 + no icon              |
| US1 #4 no due date → not overdue                  | Utility row 4 + no icon              |
| US2 #1 completed + past due → not overdue         | Utility row 5 + no icon              |
| US2 #2 mark overdue complete → indicator removed  | Re-render with `completed` truthy    |
| US2 #3 mark completed past-due incomplete → overdue | Re-render with `completed` falsy   |
