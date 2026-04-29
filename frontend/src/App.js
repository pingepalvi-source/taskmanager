import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API = '/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | completed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setTasks(res.data);
      setError('');
    } catch (err) {
      setError('Failed to load tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      await axios.post(API, { title: title.trim(), description: description.trim(), completed: false });
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      setError('Failed to add task.');
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(`${API}/${task.id}`, { ...task, completed: !task.completed });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task.');
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task.');
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = async (task) => {
    try {
      await axios.put(`${API}/${task.id}`, {
        ...task,
        title: editTitle.trim(),
        description: editDescription.trim()
      });
      setEditingId(null);
      fetchTasks();
    } catch (err) {
      setError('Failed to save edit.');
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter') action();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="app">
      <div className="container">

        {/* Header */}
        <header className="header">
          <div className="header-icon">✅</div>
          <h1>Task Manager</h1>
          <p className="subtitle">
            {completedCount} of {totalCount} tasks completed
          </p>

          {/* Progress bar */}
          {totalCount > 0 && (
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          )}
        </header>

        {/* Error */}
        {error && (
          <div className="error-banner">
            ⚠️ {error}
            <button onClick={() => setError('')} className="dismiss-btn">✕</button>
          </div>
        )}

        {/* Add Task Form */}
        <div className="add-form">
          <h2>Add New Task</h2>
          <input
            type="text"
            placeholder="Task title *"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => handleKeyDown(e, addTask)}
            className="input"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            onKeyDown={e => handleKeyDown(e, addTask)}
            className="input"
          />
          <button onClick={addTask} className="btn btn-primary" disabled={!title.trim()}>
            + Add Task
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`tab ${filter === f ? 'tab-active' : ''}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              <span className="tab-count">
                {f === 'all' ? totalCount : f === 'active' ? totalCount - completedCount : completedCount}
              </span>
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="task-list">
          {loading ? (
            <div className="empty-state">⏳ Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              {filter === 'all' ? '🎉 No tasks yet. Add one above!' :
               filter === 'active' ? '✅ No active tasks!' :
               '📝 No completed tasks yet.'}
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`task-card ${task.completed ? 'task-done' : ''}`}>
                {editingId === task.id ? (
                  /* Edit Mode */
                  <div className="edit-mode">
                    <input
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      className="input"
                      autoFocus
                    />
                    <input
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      className="input"
                      placeholder="Description"
                    />
                    <div className="edit-actions">
                      <button onClick={() => saveEdit(task)} className="btn btn-primary btn-sm">Save</button>
                      <button onClick={() => setEditingId(null)} className="btn btn-ghost btn-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  /* View Mode */
                  <div className="task-content">
                    <button
                      onClick={() => toggleComplete(task)}
                      className={`checkbox ${task.completed ? 'checked' : ''}`}
                      title="Toggle complete"
                    >
                      {task.completed ? '✓' : ''}
                    </button>
                    <div className="task-text">
                      <span className={`task-title ${task.completed ? 'strikethrough' : ''}`}>
                        {task.title}
                      </span>
                      {task.description && (
                        <span className="task-desc">{task.description}</span>
                      )}
                    </div>
                    <div className="task-actions">
                      <button onClick={() => startEdit(task)} className="icon-btn" title="Edit">✏️</button>
                      <button onClick={() => deleteTask(task.id)} className="icon-btn delete-btn" title="Delete">🗑️</button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {tasks.length > 0 && (
          <div className="footer">
            <span>{totalCount - completedCount} task{totalCount - completedCount !== 1 ? 's' : ''} remaining</span>
            {completedCount > 0 && (
              <button
                onClick={async () => {
                  const done = tasks.filter(t => t.completed);
                  await Promise.all(done.map(t => axios.delete(`${API}/${t.id}`)));
                  fetchTasks();
                }}
                className="btn btn-ghost btn-sm"
              >
                Clear completed ({completedCount})
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
