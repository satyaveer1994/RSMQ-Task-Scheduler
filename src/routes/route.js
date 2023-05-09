const express = require('express');
const router = express.Router();
const { createTask } = require('../controllers/taskController');

// Define the '/tasks' API endpoint for creating tasks
router.post('/task', createTask);

module.exports = router;