/**
 * Derive whether a todo is overdue at view time.
 *
 * A todo is overdue only when it is incomplete, has a parseable due date, and that
 * due date's local calendar day is strictly before `now`'s local calendar day.
 * Overdue state is never persisted; it is recomputed on every render.
 *
 * @param {{ dueDate?: string|null, completed?: number|boolean }|null|undefined} todo
 * @param {Date} [now=new Date()] Injectable reference date (defaults to current date).
 * @returns {boolean}
 */
export function isOverdue(todo, now = new Date()) {
  if (!todo) return false;
  if (todo.completed) return false;
  if (!todo.dueDate) return false;

  const due = new Date(todo.dueDate);
  if (Number.isNaN(due.getTime())) return false;

  // Normalize both to local calendar date (midnight), ignoring time-of-day.
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return dueDay.getTime() < today.getTime();
}

export default isOverdue;
