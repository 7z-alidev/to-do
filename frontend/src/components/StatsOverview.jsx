import React from 'react';
import { ListTodo, CheckCircle2, Clock, Percent } from 'lucide-react';

const StatsOverview = ({ stats }) => {
  const { total = 0, completed = 0, pending = 0, completionPercentage = 0 } = stats || {};

  return (
    <div className="stats-grid">
      <div className="stat-card glass-panel">
        <div className="stat-header">
          <span>Total Tasks</span>
          <ListTodo size={18} />
        </div>
        <div className="stat-value">{total}</div>
      </div>

      <div className="stat-card stat-completed glass-panel">
        <div className="stat-header">
          <span>Completed</span>
          <CheckCircle2 size={18} color="#10b981" />
        </div>
        <div className="stat-value">{completed}</div>
      </div>

      <div className="stat-card stat-pending glass-panel">
        <div className="stat-header">
          <span>Pending</span>
          <Clock size={18} color="#f59e0b" />
        </div>
        <div className="stat-value">{pending}</div>
      </div>

      <div className="stat-card stat-rate glass-panel">
        <div className="stat-header">
          <span>Completion</span>
          <Percent size={18} color="#a855f7" />
        </div>
        <div className="stat-value">{completionPercentage}%</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${completionPercentage}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
