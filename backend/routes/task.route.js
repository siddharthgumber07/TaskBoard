import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/task.controller.js'

const router = express.Router();

// Get all tasks
router.get('/get-all-tasks', getTasks);

// Create a new task
router.post('/create', createTask);

// Update a task by ID
router.put('/update/:id', updateTask);

// Delete a task by ID
router.delete('/delete/:id', deleteTask);

export default router;
