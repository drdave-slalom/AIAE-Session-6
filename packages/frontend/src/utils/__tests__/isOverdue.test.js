import { isOverdue } from '../isOverdue';

describe('isOverdue', () => {
  // Fixed reference date for deterministic assertions (local calendar date)
  const now = new Date(2026, 0, 15); // Jan 15, 2026

  const make = (overrides) => ({
    id: 1,
    title: 'Test',
    dueDate: null,
    completed: 0,
    ...overrides,
  });

  it('row 1: incomplete + due yesterday → true', () => {
    expect(isOverdue(make({ completed: 0, dueDate: '2026-01-14' }), now)).toBe(true);
  });

  it('row 2: incomplete + due today → false', () => {
    expect(isOverdue(make({ completed: 0, dueDate: '2026-01-15' }), now)).toBe(false);
  });

  it('row 3: incomplete + due tomorrow → false', () => {
    expect(isOverdue(make({ completed: 0, dueDate: '2026-01-16' }), now)).toBe(false);
  });

  it('row 4a: incomplete + null dueDate → false', () => {
    expect(isOverdue(make({ completed: 0, dueDate: null }), now)).toBe(false);
  });

  it('row 4b: incomplete + empty dueDate → false', () => {
    expect(isOverdue(make({ completed: 0, dueDate: '' }), now)).toBe(false);
  });

  it('row 5: completed + due yesterday → false', () => {
    expect(isOverdue(make({ completed: 1, dueDate: '2026-01-14' }), now)).toBe(false);
  });

  it('row 6a: completed + due today → false', () => {
    expect(isOverdue(make({ completed: 1, dueDate: '2026-01-15' }), now)).toBe(false);
  });

  it('row 6b: completed + due future → false', () => {
    expect(isOverdue(make({ completed: 1, dueDate: '2026-02-01' }), now)).toBe(false);
  });

  it('row 6c: completed + null dueDate → false', () => {
    expect(isOverdue(make({ completed: 1, dueDate: null }), now)).toBe(false);
  });

  it('row 7: invalid/unparseable dueDate → false', () => {
    expect(isOverdue(make({ completed: 0, dueDate: 'not-a-date' }), now)).toBe(false);
  });

  it('row 8a: null todo → false', () => {
    expect(isOverdue(null, now)).toBe(false);
  });

  it('row 8b: undefined todo → false', () => {
    expect(isOverdue(undefined, now)).toBe(false);
  });

  it('treats boolean completed=true as completed → false', () => {
    expect(isOverdue(make({ completed: true, dueDate: '2026-01-14' }), now)).toBe(false);
  });

  it('ignores time-of-day, comparing calendar dates only', () => {
    // due date is earlier calendar day even though now has a late reference time
    const lateNow = new Date(2026, 0, 15, 23, 59, 59);
    expect(isOverdue(make({ completed: 0, dueDate: '2026-01-14' }), lateNow)).toBe(true);
  });

  it('defaults now to the current date when omitted', () => {
    const past = make({ completed: 0, dueDate: '2000-01-01' });
    expect(isOverdue(past)).toBe(true);
  });
});
