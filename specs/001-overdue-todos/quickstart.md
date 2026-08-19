# Quickstart: Validate the Overdue Todo Indicator

This guide describes how to validate the feature end-to-end. For behavior details, see the
[UI contract](./contracts/overdue-ui.md) and [data model](./data-model.md).

## Prerequisites

- Node.js v16+ and npm v7+
- Dependencies installed from the repo root: `npm install`

## Run the automated tests

The feature is validated primarily by unit tests for the `isOverdue` utility and the
`TodoCard` rendering behavior.

```bash
# From the repo root — run the frontend test suite
npm test --workspace packages/frontend
```

**Expected**: All tests pass, including the new `isOverdue` boundary cases (yesterday /
today / tomorrow / no due date / completed) and the `TodoCard` overdue-rendering tests.
Coverage remains at or above the 80% threshold.

## Manual validation

1. Start the app (backend + frontend) per the repository README.
2. Create the following todos:
   - **A**: due **yesterday**, incomplete.
   - **B**: due **today**, incomplete.
   - **C**: due **tomorrow**, incomplete.
   - **D**: **no** due date, incomplete.
   - **E**: due **yesterday**, then mark it **complete**.
3. View the todo list and confirm:

| Todo | Expectation                                                        | Requirement |
|------|--------------------------------------------------------------------|-------------|
| A    | Shows the overdue warning icon with `aria-label` + accent styling  | FR-001/005/006 |
| B    | No overdue indicator                                               | FR-002      |
| C    | No overdue indicator                                               | FR-001      |
| D    | No overdue indicator                                               | FR-003      |
| E    | No overdue indicator (completed)                                   | FR-004      |

4. Toggle **A** to complete → the overdue indicator disappears immediately (SC-003).
5. Toggle **A** back to incomplete → the overdue indicator reappears (US2 #3).

## Accessibility check

- Using a screen reader or the accessibility inspector, confirm the overdue indicator on
  todo **A** is announced via its `aria-label` (e.g. "Overdue"), independent of color
  (FR-006, SC-004).
- Verify the indicator is perceivable in both light and dark modes with adequate contrast.

## Success signal

The feature is validated when all automated tests pass and the manual table above matches
observed behavior, confirming FR-001 through FR-007 and SC-001 through SC-004.
