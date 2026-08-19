# Phase 1 Data Model: Support for Overdue Todo Items

This feature introduces **no new persisted fields** and **no schema changes**. It adds a
single **derived** characteristic computed at view time.

## Entity: Todo (existing)

| Field       | Type                | Source     | Notes                                             |
|-------------|---------------------|------------|---------------------------------------------------|
| `id`        | integer             | Persisted  | Primary key (unchanged).                          |
| `title`     | string (≤255 chars) | Persisted  | Task title (unchanged).                           |
| `dueDate`   | string \| null      | Persisted  | Optional ISO date (`YYYY-MM-DD`); null if unset.  |
| `completed` | integer `0`\|`1`    | Persisted  | Completion status; truthy = complete (unchanged). |

### Derived characteristic (not stored)

| Name        | Type    | Computed from              | Rule                                                                 |
|-------------|---------|----------------------------|----------------------------------------------------------------------|
| `isOverdue` | boolean | `dueDate`, `completed`, now | `true` iff `!completed` AND `dueDate` present AND due date `<` today (local calendar date). |

## Derivation rules (from Functional Requirements)

- **FR-001**: `isOverdue = (not completed) AND (dueDate present) AND (dueDate < currentDate)`.
- **FR-002**: `dueDate == currentDate` (same calendar day) → `isOverdue = false`.
- **FR-003**: `dueDate` is null/empty → `isOverdue = false`.
- **FR-004**: `completed` is truthy → `isOverdue = false` (evaluated regardless of `dueDate`).
- **FR-007**: `isOverdue` is recomputed on each render; not memoized to a stored value.

### Date normalization

- Both `dueDate` and "now" are normalized to the local calendar date (midnight local) before
  comparison, so only year/month/day are compared (time-of-day is ignored).
- Invalid or unparseable `dueDate` values are treated as "no due date" → `isOverdue = false`
  (guard clause; no error thrown).

## State transitions affecting `isOverdue`

| Trigger                                   | Effect on `isOverdue`                                  |
|-------------------------------------------|-------------------------------------------------------|
| Todo marked complete (toggle)             | Becomes `false` on next render (FR-004, SC-003).      |
| Completed todo marked incomplete again    | Recomputed; `true` if due date is before today.       |
| Due date edited to a past date            | Becomes `true` on next render (if incomplete).        |
| Due date edited to today/future/cleared   | Becomes `false` on next render.                       |
| Calendar date advances past the due date  | Becomes `true` on the next render/interaction (no timer). |

## Validation rules

- No new input validation is introduced; existing title/due-date validation is unchanged.
- The utility performs defensive guards only (missing/invalid `dueDate`, missing todo).
