import React from 'react';
import { Search, Plus, Filter, ArrowUpDown } from 'lucide-react';

const TodoFilter = ({
  search,
  setSearch,
  status,
  setStatus,
  category,
  setCategory,
  priority,
  setPriority,
  sortBy,
  setSortBy,
  onOpenModal
}) => {
  const categories = ['all', 'General', 'Personal', 'Work', 'Shopping', 'Health'];
  const priorities = ['all', 'high', 'medium', 'low'];

  return (
    <div className="filter-bar glass-panel">
      <div className="filter-top">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={onOpenModal}>
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      <div className="filter-bottom">
        <div className="status-pills">
          <button
            className={`pill-btn ${status === 'all' ? 'active' : ''}`}
            onClick={() => setStatus('all')}
          >
            All
          </button>
          <button
            className={`pill-btn ${status === 'active' ? 'active' : ''}`}
            onClick={() => setStatus('active')}
          >
            Active
          </button>
          <button
            className={`pill-btn ${status === 'completed' ? 'active' : ''}`}
            onClick={() => setStatus('completed')}
          >
            Completed
          </button>
        </div>

        <div className="select-filters">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              className="custom-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              className="custom-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="all">All Priorities</option>
              {priorities.filter(p => p !== 'all').map(pri => (
                <option key={pri} value={pri}>{pri.charAt(0).toUpperCase() + pri.slice(1)}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={15} style={{ color: 'var(--text-muted)' }} />
            <select
              className="custom-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoFilter;
