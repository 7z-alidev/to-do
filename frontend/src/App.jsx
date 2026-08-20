import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import TodoFilter from './components/TodoFilter';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import AuthModal from './components/AuthModal';
import TwoFactorModal from './components/TwoFactorModal';
import AvatarModal from './components/AvatarModal';
import { todoApi, authApi } from './services/api';
import { ShieldCheck, LogIn, Lock } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);


  // Data state
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, completionPercentage: 0 });
  const [loading, setLoading] = useState(false);
  const [dbError, setDbError] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  // Theme management
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Check current auth status on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authApi.getMe();
          if (res.success) {
            setUser(res.data);
          }
        } catch (err) {
          console.error('Session expired:', err);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setAuthChecking(false);
    };
    checkAuth();
  }, []);

  // Fetch todos & stats for logged-in user
  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [todosRes, statsRes] = await Promise.all([
        todoApi.getTodos({ search, status, category, priority, sortBy, order: 'desc' }),
        todoApi.getStats()
      ]);

      if (todosRes.success) setTodos(todosRes.data);
      if (statsRes.success) setStats(statsRes.data);
      setDbError(null);
    } catch (err) {
      console.error('Failed to load data:', err);
      setDbError(
        err.response?.data?.message ||
        'Unable to load tasks from server.'
      );
    } finally {
      setLoading(false);
    }
  }, [user, search, status, category, priority, sortBy]);

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        loadData();
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setTodos([]);
      setStats({ total: 0, completed: 0, pending: 0, completionPercentage: 0 });
    }
  }, [user, loadData]);

  const handleAuthSuccess = (userData) => {
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTodos([]);
  };

  // Handle task creation or updating
  const handleSaveTodo = async (formData) => {
    try {
      if (editingTodo) {
        await todoApi.updateTodo(editingTodo._id, formData);
      } else {
        await todoApi.createTodo(formData);
      }
      setEditingTodo(null);
      loadData();
    } catch (err) {
      alert('Error saving todo: ' + (err.response?.data?.message || err.message));
    }
  };

  // Toggle completion
  const handleToggleTodo = async (id, completed) => {
    try {
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? { ...t, completed } : t))
      );
      await todoApi.updateTodo(id, { completed });
      loadData();
    } catch (err) {
      console.error('Toggle error:', err);
      loadData();
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      setTodos((prev) => prev.filter((t) => t._id !== id));
      await todoApi.deleteTodo(id);
      loadData();
    } catch (err) {
      console.error('Delete error:', err);
      loadData();
    }
  };

  // Clear completed todos
  const handleClearCompleted = async () => {
    if (!window.confirm('Clear all completed tasks?')) return;
    try {
      await todoApi.clearCompleted();
      loadData();
    } catch (err) {
      console.error('Clear completed error:', err);
      loadData();
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTodo(null);
    setIsTodoModalOpen(true);
  };

  const handleOpenEditModal = (todo) => {
    setEditingTodo(todo);
    setIsTodoModalOpen(true);
  };

  const hasCompleted = todos.some((t) => t.completed);

  if (authChecking) {
    return (
      <div className="app-container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
        <div style={{ color: 'var(--text-muted)' }}>Loading application...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpen2FA={() => setIs2FAModalOpen(true)}
        onOpenAvatar={() => setIsAvatarModalOpen(true)}
        onLogout={handleLogout}
      />


      {!user ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', marginTop: '2rem' }}>
          <div style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>
            <Lock size={64} style={{ margin: '0 auto' }} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            Secure Task Management
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: '1.6' }}>
            Sign in or create a new account to organize your tasks, protect your workflow with 2-Step Verification (2FA), and access your personalized todo list.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setIsAuthModalOpen(true)}
            style={{ margin: '0 auto', fontSize: '1.1rem', padding: '0.9rem 2rem' }}
          >
            <LogIn size={20} />
            Sign In / Get Started
          </button>
        </div>
      ) : (
        <>
          <StatsOverview stats={stats} />

          <TodoFilter
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            category={category}
            setCategory={setCategory}
            priority={priority}
            setPriority={setPriority}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onOpenModal={handleOpenCreateModal}
          />

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading tasks...
            </div>
          ) : (
            <TodoList
              todos={todos}
              onToggle={handleToggleTodo}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTodo}
              onClearCompleted={handleClearCompleted}
              hasCompleted={hasCompleted}
            />
          )}

          <TodoForm
            isOpen={isTodoModalOpen}
            onClose={() => setIsTodoModalOpen(false)}
            onSubmit={handleSaveTodo}
            initialData={editingTodo}
          />
        </>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* 2FA Setup/Manage Modal */}
      <TwoFactorModal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        user={user}
        onUpdateUser={(updatedUser) => setUser(updatedUser)}
      />

      {/* Avatar Modal */}
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        user={user}
        onUpdateUser={(updatedUser) => setUser(updatedUser)}
      />
    </div>
  );
}


export default App;
