# Feature Specification: Support for Overdue Todo Items

**Feature Branch**: `001-overdue-todos`

**Created**: 2026-08-18

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items — As a todo application user I want to easily identify and distinguish overdue tasks in my todo list so that I can prioritize my work and quickly see which tasks are past their due date."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Identify overdue todos at a glance (Priority: P1)

A user opens their todo list and needs to immediately see which incomplete tasks are past their due date, without manually comparing each due date to today's date.

**Why this priority**: This is the core value of the feature. Being able to spot overdue work instantly is the primary reason the user requested it, and it delivers a complete, usable slice on its own.

**Independent Test**: Can be fully tested by loading a list containing at least one incomplete todo whose due date is before today and confirming it is visually distinguished as overdue, while todos due today or in the future are not.

**Acceptance Scenarios**:

1. **Given** an incomplete todo with a due date before today, **When** the user views the todo list, **Then** the todo is visually marked as overdue.
2. **Given** an incomplete todo with a due date of today, **When** the user views the todo list, **Then** the todo is NOT marked as overdue.
3. **Given** an incomplete todo with a due date after today, **When** the user views the todo list, **Then** the todo is NOT marked as overdue.
4. **Given** a todo with no due date, **When** the user views the todo list, **Then** the todo is NOT marked as overdue.

---

### User Story 2 - Overdue status reflects completion (Priority: P2)

A user completes a task that was past its due date and expects it to no longer be flagged as overdue, so their attention stays on outstanding work.

**Why this priority**: Reinforces the prioritization value of the feature by ensuring only actionable (incomplete) work is highlighted, but it depends on the core detection from Story 1.

**Independent Test**: Can be tested by taking an overdue incomplete todo, marking it complete, and confirming the overdue indicator is removed.

**Acceptance Scenarios**:

1. **Given** a completed todo with a due date before today, **When** the user views the todo list, **Then** the todo is NOT marked as overdue.
2. **Given** an overdue incomplete todo, **When** the user marks it complete, **Then** the overdue indicator is removed.
3. **Given** a completed todo past its due date, **When** the user marks it incomplete again, **Then** the todo is marked as overdue.

---

### Edge Cases

- A todo whose due date is exactly today is treated as NOT overdue (the user still has the full day to complete it).
- A todo with no due date is never overdue.
- A todo that is completed is never shown as overdue, regardless of its due date.
- The overdue determination is based on the current date at the time the list is viewed, so a todo can become overdue as the calendar date advances without any user action.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST determine whether a todo is overdue based on whether it is incomplete AND its due date is earlier than the current date.
- **FR-002**: System MUST treat a todo with a due date equal to the current date as NOT overdue.
- **FR-003**: System MUST treat a todo with no due date as NOT overdue.
- **FR-004**: System MUST treat any completed todo as NOT overdue, regardless of its due date.
- **FR-005**: System MUST visually distinguish overdue todos from non-overdue todos in the list so users can identify them at a glance.
- **FR-006**: The overdue visual distinction MUST convey the overdue state through more than color alone so it remains perceivable to users who cannot distinguish colors.
- **FR-007**: System MUST reflect changes to a todo's overdue state immediately when its completion status or due date changes.

### Key Entities *(include if feature involves data)*

- **Todo**: An existing task item with a title, an optional due date, and a completion status. This feature adds a derived "overdue" characteristic computed from the due date and completion status relative to the current date; it does not introduce a new stored field.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can identify every overdue todo in a list of mixed items in under 5 seconds without inspecting individual due dates.
- **SC-002**: 100% of incomplete todos with a due date before the current date are marked as overdue, and 0% of todos due today, due in the future, without a due date, or completed are marked as overdue.
- **SC-003**: When a user completes an overdue todo, the overdue indicator disappears immediately upon the status change.
- **SC-004**: The overdue indicator is perceivable to users who rely on non-color cues (e.g., text or iconography), meeting accessibility contrast and non-color-dependency expectations.

## Assumptions

- "Current date" is the user's local calendar date; overdue determination is date-based, not time-of-day based.
- The existing todo data model already includes an optional due date and a completion status; no new persisted fields are required.
- Overdue status is derived at view time rather than stored, so it stays correct as the calendar advances without editing todos.
- No filtering, sorting, or notification behavior is introduced by this feature; only the visual distinction of overdue items is in scope, consistent with the project's defined scope.
