const express = require('express');
const router = express.Router();
const { getDb } = require('../config/db');
const auth = require('../middleware/auth');
const { ObjectId } = require('mongodb');

// Helper to map DB tasks (translates legacy statuses to match frontend columns)
const mapTask = (task) => {
  if (!task) return null;
  let status = String(task.status || '').toLowerCase();
  if (status === 'to do' || status === 'todo') {
    status = 'not started';
  } else if (status === 'done') {
    status = 'completed';
  } else if (status === 'review') {
    status = 'under review';
  }

  let taskCode = task.taskCode;
  if (!taskCode && task._id) {
    const idStr = task._id.toString();
    if (idStr.endsWith('9c')) taskCode = 'TSK-101';
    else if (idStr.endsWith('9d')) taskCode = 'TSK-102';
    else if (idStr.endsWith('9e')) taskCode = 'TSK-103';
    else {
      taskCode = `TSK-104`;
    }
  }

  return {
    ...task,
    id: task._id ? task._id.toString() : null,
    status,
    taskCode
  };
};

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const db = getDb();
    const tasks = await db.collection('tasks').find().toArray();
    const mappedTasks = tasks.map(mapTask);
    res.json(mappedTasks);
  } catch (err) {
    console.error("Fetch tasks error:", err);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private (HR/CEO or managers)
router.post('/', auth, async (req, res) => {
  const { title, description, status, priority, startDate, deadline, dueDate, assignedTo, expectedOutcome, assignedBy } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Task title is required" });
  }

  try {
    const db = getDb();
    
    // Count existing tasks to assign next sequential code
    const count = await db.collection('tasks').countDocuments();
    const taskCode = `TSK-${101 + count}`;
    
    const newTask = {
      taskCode,
      title,
      description: description || '',
      status: status || 'not started', // 'not started', 'in progress', 'blocked', 'under review', 'completed'
      priority: priority || 'Medium', // 'Low', 'Medium', 'High'
      startDate: startDate ? new Date(startDate).toISOString() : null,
      deadline: deadline ? new Date(deadline || dueDate).toISOString() : null,
      dueDate: (dueDate || deadline) ? new Date(dueDate || deadline).toISOString() : null,
      assignedTo: assignedTo || [], // Array of employee IDs (e.g., ["EMP003"])
      expectedOutcome: expectedOutcome || '',
      assignedBy: assignedBy || req.user.name,
      comments: [],
      createdAt: new Date().toISOString(),
      creatorId: new ObjectId(req.user.id)
    };

    const result = await db.collection('tasks').insertOne(newTask);
    newTask._id = result.insertedId;

    res.status(201).json(mapTask(newTask));
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
    const allowedFields = ['title', 'description', 'status', 'priority', 'startDate', 'deadline', 'dueDate', 'assignedTo', 'expectedOutcome', 'assignedBy'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (updates.startDate) {
      updates.startDate = new Date(updates.startDate).toISOString();
    }
    if (updates.deadline) {
      updates.deadline = new Date(updates.deadline).toISOString();
    }
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
    res.json(mapTask(updatedTask));
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
    res.status(201).json({ message: "Comment added successfully", task: mapTask(updatedTask), comment: newComment });
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

// @route   DELETE /api/tasks/:id/comments/:commentId
// @desc    Delete a comment from a task
// @access  Private (HR/CEO or comment owner)
router.delete('/:id/comments/:commentId', auth, async (req, res) => {
  const taskId = req.params.id;
  const commentId = req.params.commentId;

  if (!ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid Task ID format" });
  }

  try {
    const db = getDb();
    
    // Find task
    const task = await db.collection('tasks').findOne({ _id: new ObjectId(taskId) });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    
    // Find comment
    const comment = task.comments.find(c => c.id === commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    
    // Check permissions: CEO/HR, or the comment author
    if (req.user.role !== 'CEO' && req.user.role !== 'HR' && comment.userId && comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You can only delete your own comments." });
    }
    
    const result = await db.collection('tasks').findOneAndUpdate(
      { _id: new ObjectId(taskId) },
      { $pull: { comments: { id: commentId } } },
      { returnDocument: 'after' }
    );
    
    const updatedTask = result.value || result;
    res.json(mapTask(updatedTask));
  } catch (err) {
    console.error("Delete comment error:", err);
    res.status(500).json({ message: "Server error deleting comment" });
  }
});

module.exports = router;
