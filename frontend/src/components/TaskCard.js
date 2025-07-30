import React from 'react';
import { FiEdit, FiTrash2, FiCalendar, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { formatDate, getDaysRemaining } from '../utils/helpers';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const daysRemaining = getDaysRemaining(task.end_date);
  const isOverdue = task.isOverdue;
  const isCompleted = task.completed;

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className={`task-card card ${getPriorityClass(task.priority)} ${isOverdue ? 'overdue' : ''} ${isCompleted ? 'task-completed' : ''}`}>
      <div className="card-body">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-actions">
            <button
              onClick={() => onToggleComplete(task.id, !task.completed)}
              className={`btn btn-sm ${isCompleted ? 'btn-secondary' : 'btn-success'}`}
              title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {isCompleted ? <FiX /> : <FiCheck />}
            </button>
            <button
              onClick={() => onEdit(task)}
              className="btn btn-outline btn-sm"
              title="Edit task"
            >
              <FiEdit />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="btn btn-danger btn-sm"
              title="Delete task"
            >
              <FiTrash2 />
            </button>
          </div>
        </div>

        <div className="task-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FiCalendar size={12} />
            <span>Due: {formatDate(task.end_date)}</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <FiClock size={12} />
            <span>
              {isCompleted 
                ? 'Completed' 
                : isOverdue 
                  ? `Overdue by ${Math.abs(daysRemaining)} days`
                  : daysRemaining === 0 
                    ? 'Due today'
                    : `${daysRemaining} days remaining`
              }
            </span>
          </div>

          <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
            {task.priority} priority
          </span>

          {isOverdue && !isCompleted && (
            <span className="overdue-badge">Overdue</span>
          )}
        </div>

        {task.description && (
          <div className="task-description">
            {task.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
