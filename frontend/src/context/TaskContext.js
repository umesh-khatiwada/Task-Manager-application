import React, { createContext, useContext, useReducer } from 'react';
import { taskAPI } from '../services/api';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  total: 0,
};

// Action types
const TASK_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  GET_TASKS_SUCCESS: 'GET_TASKS_SUCCESS',
  GET_TASK_SUCCESS: 'GET_TASK_SUCCESS',
  CREATE_TASK_SUCCESS: 'CREATE_TASK_SUCCESS',
  UPDATE_TASK_SUCCESS: 'UPDATE_TASK_SUCCESS',
  DELETE_TASK_SUCCESS: 'DELETE_TASK_SUCCESS',
  TASK_ERROR: 'TASK_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_CURRENT_TASK: 'CLEAR_CURRENT_TASK',
};

// Reducer
const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case TASK_ACTIONS.GET_TASKS_SUCCESS:
      return {
        ...state,
        tasks: action.payload.tasks,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.currentPage,
        total: action.payload.total,
        loading: false,
        error: null,
      };

    case TASK_ACTIONS.GET_TASK_SUCCESS:
      return {
        ...state,
        currentTask: action.payload,
        loading: false,
        error: null,
      };

    case TASK_ACTIONS.CREATE_TASK_SUCCESS:
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        loading: false,
        error: null,
      };

    case TASK_ACTIONS.UPDATE_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
        currentTask: state.currentTask?.id === action.payload.id ? action.payload : state.currentTask,
        loading: false,
        error: null,
      };

    case TASK_ACTIONS.DELETE_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        currentTask: state.currentTask?.id === action.payload ? null : state.currentTask,
        loading: false,
        error: null,
      };

    case TASK_ACTIONS.TASK_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case TASK_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case TASK_ACTIONS.CLEAR_CURRENT_TASK:
      return {
        ...state,
        currentTask: null,
      };

    default:
      return state;
  }
};

// Create context
const TaskContext = createContext();

// Task provider component
export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Get tasks
  const getTasks = async (params = {}) => {
    dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await taskAPI.getTasks(params);
      dispatch({
        type: TASK_ACTIONS.GET_TASKS_SUCCESS,
        payload: response.data,
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      dispatch({
        type: TASK_ACTIONS.TASK_ERROR,
        payload: message,
      });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Get single task
  const getTask = async (id) => {
    dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await taskAPI.getTask(id);
      dispatch({
        type: TASK_ACTIONS.GET_TASK_SUCCESS,
        payload: response.data.task,
      });
      return { success: true, task: response.data.task };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch task';
      dispatch({
        type: TASK_ACTIONS.TASK_ERROR,
        payload: message,
      });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Create task
  const createTask = async (taskData) => {
    dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await taskAPI.createTask(taskData);
      dispatch({
        type: TASK_ACTIONS.CREATE_TASK_SUCCESS,
        payload: response.data.task,
      });
      toast.success('Task created successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      dispatch({
        type: TASK_ACTIONS.TASK_ERROR,
        payload: message,
      });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
    try {
      const response = await taskAPI.updateTask(id, taskData);
      dispatch({
        type: TASK_ACTIONS.UPDATE_TASK_SUCCESS,
        payload: response.data.task,
      });
      toast.success('Task updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      dispatch({
        type: TASK_ACTIONS.TASK_ERROR,
        payload: message,
      });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
    try {
      await taskAPI.deleteTask(id);
      dispatch({
        type: TASK_ACTIONS.DELETE_TASK_SUCCESS,
        payload: id,
      });
      toast.success('Task deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      dispatch({
        type: TASK_ACTIONS.TASK_ERROR,
        payload: message,
      });
      toast.error(message);
      return { success: false, message };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: TASK_ACTIONS.CLEAR_ERROR });
  };

  // Clear current task
  const clearCurrentTask = () => {
    dispatch({ type: TASK_ACTIONS.CLEAR_CURRENT_TASK });
  };

  const value = {
    ...state,
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    clearError,
    clearCurrentTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Custom hook to use task context
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;
