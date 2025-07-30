// Date formatting utilities
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isOverdue = (endDate, completed = false) => {
  if (completed) return false;
  return new Date() > new Date(endDate);
};

export const getDaysRemaining = (endDate) => {
  const today = new Date();
  const end = new Date(endDate);
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Priority colors
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return '#ef4444'; // red
    case 'medium':
      return '#f59e0b'; // orange
    case 'low':
      return '#10b981'; // green
    default:
      return '#6b7280'; // gray
  }
};

export const getPriorityBackground = (priority) => {
  switch (priority) {
    case 'high':
      return '#fef2f2'; // red-50
    case 'medium':
      return '#fffbeb'; // orange-50
    case 'low':
      return '#f0fdf4'; // green-50
    default:
      return '#f9fafb'; // gray-50
  }
};

// Form validation
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // At least 6 characters, one uppercase, one lowercase, one number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
  return re.test(password);
};

// Local storage helpers
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error getting from localStorage:', error);
    return null;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting to localStorage:', error);
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};
