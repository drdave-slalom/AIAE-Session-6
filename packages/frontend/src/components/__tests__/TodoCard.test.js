import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });
});

describe('TodoCard overdue indicator', () => {
  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  // Deterministic due-date strings relative to the real current calendar date.
  const toDateString = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const yesterday = () => toDateString(-1);
  const today = () => toDateString(0);
  const tomorrow = () => toDateString(1);

  const makeTodo = (overrides) => ({
    id: 42,
    title: 'Overdue Test',
    dueDate: null,
    completed: 0,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // T004 [US1]
  it('renders a warning icon with aria-label="Overdue" and the overdue class for an incomplete past-due todo', () => {
    const { container } = render(
      <TodoCard todo={makeTodo({ dueDate: yesterday(), completed: 0 })} {...mockHandlers} isLoading={false} />
    );

    expect(screen.getByLabelText('Overdue')).toBeInTheDocument();
    expect(container.querySelector('.todo-card')).toHaveClass('todo-card--overdue');
  });

  it('renders NO overdue indicator for an incomplete todo due today', () => {
    const { container } = render(
      <TodoCard todo={makeTodo({ dueDate: today(), completed: 0 })} {...mockHandlers} isLoading={false} />
    );

    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
    expect(container.querySelector('.todo-card')).not.toHaveClass('todo-card--overdue');
  });

  it('renders NO overdue indicator for an incomplete todo due tomorrow', () => {
    const { container } = render(
      <TodoCard todo={makeTodo({ dueDate: tomorrow(), completed: 0 })} {...mockHandlers} isLoading={false} />
    );

    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
    expect(container.querySelector('.todo-card')).not.toHaveClass('todo-card--overdue');
  });

  it('renders NO overdue indicator for an incomplete todo with no due date', () => {
    const { container } = render(
      <TodoCard todo={makeTodo({ dueDate: null, completed: 0 })} {...mockHandlers} isLoading={false} />
    );

    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
    expect(container.querySelector('.todo-card')).not.toHaveClass('todo-card--overdue');
  });

  // T007 [US2]
  it('renders NO overdue indicator for a completed past-due todo', () => {
    const { container } = render(
      <TodoCard todo={makeTodo({ dueDate: yesterday(), completed: 1 })} {...mockHandlers} isLoading={false} />
    );

    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
    expect(container.querySelector('.todo-card')).not.toHaveClass('todo-card--overdue');
  });

  it('removes the indicator when a past-due todo is toggled complete and restores it when toggled incomplete', () => {
    const overdueTodo = makeTodo({ dueDate: yesterday(), completed: 0 });
    const { container, rerender } = render(
      <TodoCard todo={overdueTodo} {...mockHandlers} isLoading={false} />
    );
    expect(screen.getByLabelText('Overdue')).toBeInTheDocument();

    rerender(<TodoCard todo={{ ...overdueTodo, completed: 1 }} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
    expect(container.querySelector('.todo-card')).not.toHaveClass('todo-card--overdue');

    rerender(<TodoCard todo={{ ...overdueTodo, completed: 0 }} {...mockHandlers} isLoading={false} />);
    expect(screen.getByLabelText('Overdue')).toBeInTheDocument();
    expect(container.querySelector('.todo-card')).toHaveClass('todo-card--overdue');
  });

  it('adds the indicator when an incomplete todo\'s due date changes to a past date and removes it when changed back', () => {
    const todo = makeTodo({ dueDate: tomorrow(), completed: 0 });
    const { container, rerender } = render(
      <TodoCard todo={todo} {...mockHandlers} isLoading={false} />
    );
    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();

    rerender(<TodoCard todo={{ ...todo, dueDate: yesterday() }} {...mockHandlers} isLoading={false} />);
    expect(screen.getByLabelText('Overdue')).toBeInTheDocument();
    expect(container.querySelector('.todo-card')).toHaveClass('todo-card--overdue');

    rerender(<TodoCard todo={{ ...todo, dueDate: null }} {...mockHandlers} isLoading={false} />);
    expect(screen.queryByLabelText('Overdue')).not.toBeInTheDocument();
    expect(container.querySelector('.todo-card')).not.toHaveClass('todo-card--overdue');
  });
});
