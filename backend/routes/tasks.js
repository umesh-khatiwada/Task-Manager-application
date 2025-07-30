const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const {
  taskValidation,
  taskUpdateValidation
} = require('../middleware/validation');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

router
  .route('/')
  .get(getTasks)
  .post(taskValidation, createTask);

router
  .route('/:id')
  .get(getTask)
  .put(taskUpdateValidation, updateTask)
  .delete(deleteTask);

module.exports = router;
