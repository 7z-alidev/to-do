import React from 'react';
import { Edit2, Trash2, Calendar } from 'lucide-react';

const TodoItem = ({ todo, onToggle, onEdit, onDelete }) => {
  const { _id, title, description, completed, priority, category, dueDate } = todo;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formattedDueDate = formatDate(dueDate);

  return (
    <div className={`todo-card glass-panel ${completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="checkbox-custom"
        checked={completed}
        onChange={() => onToggle(_id, !completed)}
        aria-label={`Mark task ${title} as ${completed ? 'incomplete' : 'complete'}`}
      />

      <div className="todo-content">
        <div className="todo-header-row">
          <h3 className="todo-title">{title}</h3>
          
          <div className="todo-actions">
            <button
              className="icon-btn"
              onClick={() => onEdit(todo)}
              title="Edit Task"
              aria-label="Edit task"
            >
              <Edit2 size={16} />
            </button>
            <button
              className="icon-btn delete"
              onClick={() => onDelete(_id)}
              title="Delete Task"
              aria-label="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {description && <p className="todo-desc">{description}</p>}

        <div className="todo-meta">
          <span className={`badge badge-priority-${priority}`}>
            {priority}
          </span>

          <span className="badge badge-category">
            {category}
          </span>

          {formattedDueDate && (
            <span className="due-date">
              <Calendar size={13} />
              <span>Due: {formattedDueDate}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
