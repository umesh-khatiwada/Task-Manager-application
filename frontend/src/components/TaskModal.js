import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const TaskModal = ({ isOpen, onClose, onSubmit, task, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    end_date: '',
    completed: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      // Edit mode - populate form with task data
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        end_date: task.end_date.split('T')[0], // Format date for input
        completed: task.completed,
      });
    } else {
      // Create mode - reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        end_date: '',
        completed: false,
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    } else {
      const selectedDate = new Date(formData.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today && !task) {
        // Only check future date for new tasks
        newErrors.end_date = 'End date must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Convert end_date to ISO string
    const submitData = {
      ...formData,
      end_date: new Date(formData.end_date).toISOString(),
    };

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <h2 className='modal-title'>
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button onClick={onClose} className='modal-close'>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='modal-body'>
            <div className='form-group'>
              <label htmlFor='title' className='form-label'>
                Title *
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleChange}
                className='form-input'
                placeholder='Enter task title'
                maxLength={200}
              />
              {errors.title && <div className='form-error'>{errors.title}</div>}
            </div>

            <div className='form-group'>
              <label htmlFor='description' className='form-label'>
                Description
              </label>
              <textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleChange}
                className='form-textarea'
                placeholder='Enter task description (optional)'
                rows={4}
                maxLength={1000}
              />
              {errors.description && (
                <div className='form-error'>{errors.description}</div>
              )}
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  textAlign: 'right',
                }}
              >
                {formData.description.length}/1000
              </div>
            </div>

            <div className='form-group'>
              <label htmlFor='priority' className='form-label'>
                Priority
              </label>
              <select
                id='priority'
                name='priority'
                value={formData.priority}
                onChange={handleChange}
                className='form-select'
              >
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
              </select>
            </div>

            <div className='form-group'>
              <label htmlFor='end_date' className='form-label'>
                End Date *
              </label>
              <input
                type='date'
                id='end_date'
                name='end_date'
                value={formData.end_date}
                onChange={handleChange}
                className='form-input'
              />
              {errors.end_date && (
                <div className='form-error'>{errors.end_date}</div>
              )}
            </div>

            {task && (
              <div className='form-group'>
                <label
                  className='form-label'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <input
                    type='checkbox'
                    name='completed'
                    checked={formData.completed}
                    onChange={handleChange}
                  />
                  Mark as completed
                </label>
              </div>
            )}
          </div>

          <div className='modal-footer'>
            <button
              type='button'
              onClick={onClose}
              className='btn btn-outline'
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={loading}
            >
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
