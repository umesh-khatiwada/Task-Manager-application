import React, { useState, useEffect, useCallback } from 'react';
import { useTask } from '../context/TaskContext';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Loading from '../components/Loading';
import { FiPlus, FiRefreshCw } from 'react-icons/fi';

const Dashboard = () => {
  const {
    tasks,
    loading,
    totalPages,
    currentPage,
    total,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTask();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'DESC',
    priority: '',
    completed: '',
  });

  // Load tasks function with useCallback to prevent unnecessary re-renders
  const loadTasks = useCallback(async () => {
    await getTasks(filters);
  }, [getTasks, filters]);

  // Load tasks on component mount and when filters change
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const result = await deleteTask(taskId);
      if (result.success) {
        // Reload current page or go to previous page if current page is empty
        if (tasks.length === 1 && currentPage > 1) {
          setFilters((prev) => ({ ...prev, page: currentPage - 1 }));
        } else {
          loadTasks();
        }
      }
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    await updateTask(taskId, { completed });
  };

  const handleModalSubmit = async (taskData) => {
    let result;
    if (editingTask) {
      result = await updateTask(editingTask.id, taskData);
    } else {
      result = await createTask(taskData);
    }

    if (result.success) {
      setIsModalOpen(false);
      setEditingTask(null);
      // Reload tasks to get updated data
      loadTasks();
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleRefresh = () => {
    loadTasks();
  };

  return (
    <div className='main-content'>
      <div className='container'>
        <div className='dashboard-header'>
          <h1 className='dashboard-title'>My Tasks</h1>
          <button onClick={handleCreateTask} className='btn btn-primary'>
            <FiPlus />
            Add New Task
          </button>
        </div>

        {/* Controls */}
        <div className='task-controls'>
          <div className='task-filters'>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className='form-select'
              style={{ minWidth: '120px' }}
            >
              <option value=''>All Priorities</option>
              <option value='high'>High</option>
              <option value='medium'>Medium</option>
              <option value='low'>Low</option>
            </select>

            <select
              value={filters.completed}
              onChange={(e) => handleFilterChange('completed', e.target.value)}
              className='form-select'
              style={{ minWidth: '120px' }}
            >
              <option value=''>All Tasks</option>
              <option value='false'>Pending</option>
              <option value='true'>Completed</option>
            </select>

            <div className='task-sort'>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className='form-select'
                style={{ minWidth: '120px' }}
              >
                <option value='created_at'>Created Date</option>
                <option value='end_date'>Due Date</option>
                <option value='priority'>Priority</option>
                <option value='title'>Title</option>
              </select>

              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange('sortOrder', e.target.value)
                }
                className='form-select'
                style={{ minWidth: '100px' }}
              >
                <option value='DESC'>Descending</option>
                <option value='ASC'>Ascending</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className='btn btn-outline'
            disabled={loading}
          >
            <FiRefreshCw />
            Refresh
          </button>
        </div>

        {/* Task List */}
        {loading ? (
          <Loading message='Loading tasks...' />
        ) : tasks.length === 0 ? (
          <div className='empty-state'>
            <div className='empty-state-icon'>📝</div>
            <h3>No tasks found</h3>
            <p>
              {Object.values(filters).some(
                (v) =>
                  v && v !== 'created_at' && v !== 'DESC' && v !== 1 && v !== 10
              )
                ? 'No tasks match your current filters. Try adjusting your filters or create a new task.'
                : "You don't have any tasks yet. Create your first task to get started!"}
            </p>
            <button
              onClick={handleCreateTask}
              className='btn btn-primary'
              style={{ marginTop: '1rem' }}
            >
              <FiPlus />
              Create Your First Task
            </button>
          </div>
        ) : (
          <>
            <div className='task-list'>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='pagination'>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='btn btn-outline'
                >
                  Previous
                </button>

                <div className='pagination-info'>
                  Page {currentPage} of {totalPages} ({total} total tasks)
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className='btn btn-outline'
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleModalSubmit}
          task={editingTask}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
