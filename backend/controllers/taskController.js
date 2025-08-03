const { validationResult } = require('express-validator');
const { Task } = require('../models');

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      priority,
      completed,
    } = req.query;

    // Build where clause
    const where = { user_id: req.user.id };

    if (priority) {
      where.priority = priority;
    }

    if (completed !== undefined) {
      where.completed = completed === 'true';
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Get tasks with pagination
    const { count, rows: tasks } = await Task.findAndCountAll({
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Add overdue status to each task
    const tasksWithStatus = tasks.map((task) => {
      const taskData = task.toJSON();
      taskData.isOverdue = task.isOverdue();
      return taskData;
    });

    res.status(200).json({
      success: true,
      count: tasksWithStatus.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      tasks: tasksWithStatus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const taskData = task.toJSON();
    taskData.isOverdue = task.isOverdue();

    res.status(200).json({
      success: true,
      task: taskData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { title, description, priority, end_date } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      end_date,
      user_id: req.user.id,
    });

    const taskData = task.toJSON();
    taskData.isOverdue = task.isOverdue();

    res.status(201).json({
      success: true,
      task: taskData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    let task = await Task.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const { title, description, priority, end_date, completed } = req.body;

    task = await task.update({
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      priority: priority || task.priority,
      end_date: end_date || task.end_date,
      completed: completed !== undefined ? completed : task.completed,
    });

    const taskData = task.toJSON();
    taskData.isOverdue = task.isOverdue();

    res.status(200).json({
      success: true,
      task: taskData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await task.destroy();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};
