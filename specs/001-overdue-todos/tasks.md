---
description: "Task list for feature implementation: Support for Overdue Todo Items"
---

# Tasks: Support for Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todos/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/overdue-ui.md, quickstart.md

**Tests**: Test tasks ARE included — the plan (Constitution II) and the UI contract require test-first, deterministic unit tests for the `isOverdue` utility and `TodoCard` rendering behavior.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2)
- Include exact file paths in descriptions

## Path Conventions

- Web application monorepo (npm workspaces): `packages/frontend/`, `packages/backend/`
- This feature is **frontend-only**; no backend changes.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the frontend structure for the new shared utility

- [ ] T001 Create the `utils/` directory and its test folder in `packages/frontend/src/utils/` and `packages/frontend/src/utils/__tests__/` (per plan.md project structure)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The shared `isOverdue` derivation utility that BOTH user stories depend on

**⚠️ CRITICAL**: No user story UI work can begin until this utility exists

### Tests for Foundational (write FIRST, ensure they FAIL before implementation) ⚠️

- [ ] T002 [P] Write unit tests for `isOverdue(todo, now)` in `packages/frontend/src/utils/__tests__/isOverdue.test.js` covering all behavior-table rows from `contracts/overdue-ui.md`: (1) incomplete + due yesterday → true, (2) incomplete + due today → false, (3) incomplete + due tomorrow → false, (4) incomplete + null/empty dueDate → false, (5) completed + due yesterday → false, (6) completed + today/future/null → false, (7) invalid/unparseable dueDate → false, (8) null/undefined todo → false. Inject a fixed `now` reference date for determinism.

### Implementation for Foundational

- [ ] T003 Implement pure function `isOverdue(todo, now = new Date())` in `packages/frontend/src/utils/isOverdue.js`: return `true` only when `todo` is present, `!todo.completed` (truthy check), `todo.dueDate` is a parseable date, and the due calendar date (local midnight) is strictly before `now`'s calendar date; guard clauses return `false` for missing todo, missing/invalid `dueDate`, or completed todos (FR-001–FR-004, FR-007; data-model.md derivation + date-normalization rules)

**Checkpoint**: `isOverdue` unit tests pass; utility ready for use by `TodoCard`

---

## Phase 3: User Story 1 - Identify overdue todos at a glance (Priority: P1) 🎯 MVP

**Goal**: Incomplete todos whose due date is before today are visually distinguished in the list via a warning icon with a descriptive `aria-label` plus accent-color styling; todos due today, in the future, or with no due date are not marked.

**Independent Test**: Load a list with one incomplete todo due yesterday, one due today, one due tomorrow, and one with no due date; confirm only the yesterday todo shows the overdue indicator.

### Tests for User Story 1 (write FIRST, ensure they FAIL before implementation) ⚠️

- [ ] T004 [P] [US1] Add `TodoCard` overdue-rendering tests in `packages/frontend/src/components/__tests__/TodoCard.test.js`: an incomplete todo due yesterday renders a warning icon with an `aria-label` (e.g. "Overdue") and the `todo-card--overdue` class; incomplete todos due today, due tomorrow, and with no due date render NO overdue icon and NO overdue class. Use a fixed reference date for determinism (FR-002/FR-003/FR-005/FR-006).

### Implementation for User Story 1

- [ ] T005 [US1] Modify `packages/frontend/src/components/TodoCard.js` to import `isOverdue` from `../utils/isOverdue`, compute overdue state at render time, and when true render a warning icon (e.g. `⚠`) with a descriptive `aria-label` (e.g. `aria-label="Overdue"`) and apply the `todo-card--overdue` class; when false render neither (FR-005, FR-006; contracts/overdue-ui.md component contract)
- [ ] T006 [P] [US1] Add `todo-card--overdue` accent/danger styling in `packages/frontend/src/styles/theme.css` (and/or `packages/frontend/src/App.css` if card styles live there) using existing `--danger-color` / `--color-accent` design tokens, supporting light and dark themes with WCAG AA contrast (FR-005, FR-006, SC-004)

**Checkpoint**: User Story 1 fully functional — overdue incomplete todos are visually distinguished and testable independently (MVP complete)

---

## Phase 4: User Story 2 - Overdue status reflects completion (Priority: P2)

**Goal**: A completed todo is never marked overdue, and toggling a past-due todo's completion status immediately adds/removes the overdue indicator on the next render.

**Independent Test**: Take an overdue incomplete todo, mark it complete → indicator disappears; mark it incomplete again → indicator reappears.

### Tests for User Story 2 (write FIRST, ensure they FAIL before implementation) ⚠️

- [ ] T007 [P] [US2] Add `TodoCard` completion-transition tests in `packages/frontend/src/components/__tests__/TodoCard.test.js`: a completed todo with a past due date renders NO overdue indicator; re-rendering the same past-due todo with `completed` toggled true→removes the indicator and false→restores it (FR-004, SC-003, US2 acceptance scenarios #1–#3)

### Implementation for User Story 2

- [ ] T008 [US2] Verify/adjust `packages/frontend/src/components/TodoCard.js` so the overdue indicator recomputes from `isOverdue` on every render (driven by the `completed` prop) and requires no persisted overdue field or extra state; make only the minimal change needed for the T007 tests to pass (FR-004, FR-007)

**Checkpoint**: User Stories 1 AND 2 both work independently

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and quality gates

- [ ] T009 [P] Run the frontend test suite and confirm coverage stays at/above the 80% threshold: `npm test --workspace packages/frontend` (quickstart.md, Constitution II)
- [ ] T010 Execute the manual validation and accessibility checks in `specs/001-overdue-todos/quickstart.md` (todos A–E table, toggle behavior, screen-reader `aria-label`, light/dark contrast) confirming FR-001–FR-007 and SC-001–SC-004

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS both user stories (provides `isOverdue`)
- **User Story 1 (Phase 3)**: Depends on Foundational — MVP, no dependency on US2
- **User Story 2 (Phase 4)**: Depends on Foundational; builds on the `TodoCard` from US1
- **Polish (Phase 5)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Requires `isOverdue` (Phase 2). Independently testable.
- **User Story 2 (P2)**: Requires `isOverdue` (Phase 2) and the overdue rendering added in US1; independently testable via completion transitions.

### Within Each User Story

- Tests are written FIRST and MUST FAIL before implementation
- Utility (Foundational) before `TodoCard` consumption
- `TodoCard` logic before styling refinements

### Parallel Opportunities

- T002 (utility tests) is [P] — isolated file
- T004 and T006 are [P] within US1 (test file vs. CSS file — different files); T005 must precede final verification
- T007 is [P] within US2 (test file)
- T009 is [P] in Polish

---

## Parallel Example: User Story 1

```bash
# After Foundational (Phase 2) is complete, within User Story 1:
Task: "T004 [P] [US1] Add TodoCard overdue-rendering tests in packages/frontend/src/components/__tests__/TodoCard.test.js"
Task: "T006 [P] [US1] Add todo-card--overdue styling in packages/frontend/src/styles/theme.css"
# Then implement T005 (TodoCard.js) to make the tests pass.
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (`isOverdue` utility — CRITICAL, blocks both stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Confirm overdue incomplete todos are distinguished (Independent Test)
5. Demo the MVP

### Incremental Delivery

1. Setup + Foundational → utility ready
2. Add User Story 1 → test independently → demo (MVP: at-a-glance overdue detection)
3. Add User Story 2 → test independently → demo (completion reflects overdue state)
4. Polish → run full suite + manual/accessibility validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps each task to its user story for traceability
- This feature is frontend-only: no backend, API, schema, or persisted-field changes
- Overdue is derived at render time; never store it
- Inject a fixed reference date in tests to keep date-based assertions deterministic
- Verify tests fail before implementing; commit after each task or logical group
