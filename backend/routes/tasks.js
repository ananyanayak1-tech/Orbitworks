const express = require('express');
const router = express.Router();
const { getDb } = require('../config/db');
const auth = require('../middleware/auth');
const { ObjectId } = require('mongodb');

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const db = getDb();
    const tasks = await db.collection('tasks').find().toArray();
    res.json(tasks);
  } catch (err) {
    console.error("Fetch tasks error:", err);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private (HR/CEO or managers)
router.post('/', auth, async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Task title is required" });
  }

  try {
    const db = getDb();
    
    const newTask = {
      title,
      description: description || '',
      status: status || 'To Do', // 'To Do', 'In Progress', 'Review', 'Done'
      priority: priority || 'Medium', // 'Low', 'Medium', 'High'
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      assignedTo: assignedTo || [], // Array of employee IDs (e.g., ["EMP003"])
      comments: [],
      createdAt: new Date().toISOString(),
      creatorId: new ObjectId(req.user.id)
    };

    const result = await db.collection('tasks').insertOne(newTask);
    newTask._id = result.insertedId;

    res.status(201).json(newTask);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Server error creating task" });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task status or other fields (supports Kanban drag-drops)
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const taskId = req.params.id;

  if (!ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid Task ID format" });
  }

  try {
    const db = getDb();
    
    // Filter updates
    const updates = {};
    const allowedFields = ['title', 'description', 'status', 'priority', 'dueDate', 'assignedTo'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate).toISOString();
    }

    const result = await db.collection('tasks').findOneAndUpdate(
      { _id: new ObjectId(taskId) },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Support both older and newer MongoDB driver return formats
    const updatedTask = result.value || result;
    res.json(updatedTask);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Server error updating task" });
  }
});

// @route   POST /api/tasks/:id/comments
// @desc    Add a comment to a task
// @access  Private
router.post('/:id/comments', auth, async (req, res) => {
  const taskId = req.params.id;
  const { text } = req.body;

  if (!ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid Task ID format" });
  }

  if (!text || text.trim() === '') {
    return res.status(400).json({ message: "Comment text cannot be empty" });
  }

  try {
    const db = getDb();

    const newComment = {
      id: new ObjectId().toString(), // Custom comment ID
      userId: new ObjectId(req.user.id),
      userName: req.user.name,
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    const result = await db.collection('tasks').findOneAndUpdate(
      { _id: new ObjectId(taskId) },
      { $push: { comments: newComment } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = result.value || result;
    res.status(201).json({ message: "Comment added successfully", task: updatedTask, comment: newComment });
  } catch (err) {
    console.error("Add comment error:", err);
    res.status(500).json({ message: "Server error adding comment" });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private (HR/CEO or task creator)
router.delete('/:id', auth, async (req, res) => {
  const taskId = req.params.id;

  if (!ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid Task ID format" });
  }

  try {
    const db = getDb();
    const task = await db.collection('tasks').findOne({ _id: new ObjectId(taskId) });
    
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only allow deletion if user is HR/CEO, or is the creator of the task
    if (req.user.role !== 'HR' && req.user.role !== 'CEO' && task.creatorId && task.creatorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You can only delete tasks you created." });
    }

    await db.collection('tasks').deleteOne({ _id: new ObjectId(taskId) });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Server error deleting task" });
  }
});

module.exports = router;
