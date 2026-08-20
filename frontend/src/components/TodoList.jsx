import React from 'react';
import TodoItem from './TodoItem';
import { CheckCheck, Sparkles } from 'lucide-react';

const TodoList = ({ todos, onToggle, onEdit, onDelete, onClearCompleted, hasCompleted }) => {
  if (todos.length === 0) {
    return (
      <div className="glass-panel empty-state">
        <div className="empty-icon">✨</div>
        <h3>No tasks found</h3>
        <p>Enjoy your free time or create a new task to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="glass-panel list-footer">
        <span>
          Showing {todos.length} {todos.length === 1 ? 'task' : 'tasks'}
        </span>

        {hasCompleted && (
          <button className="btn-text-danger" onClick={onClearCompleted}>
            <CheckCheck size={16} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            Clear Completed Tasks
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoList;
