const express = require('express');
const router = express.Router();
const { getDb } = require('../config/db');
const auth = require('../middleware/auth');
const { ObjectId } = require('mongodb');

// Helper to check if user is HR or CEO
const isHRorCEO = (req, res, next) => {
  if (req.user.role === 'HR' || req.user.role === 'CEO') {
    next();
  } else {
    res.status(403).json({ message: "Access denied. HR or CEO permissions required." });
  }
};

// ==========================================
// Announcements Endpoints
// ==========================================

// @route   GET /api/misc/announcements
// @desc    Get all active announcements
// @access  Private
router.get('/announcements', auth, async (req, res) => {
  try {
    const db = getDb();
    // Sort announcements by post date (newest first)
    const announcements = await db.collection('announcements')
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.json(announcements);
  } catch (err) {
    console.error("Fetch announcements error:", err);
    res.status(500).json({ message: "Server error fetching announcements" });
  }
});

// @route   POST /api/misc/announcements
// @desc    Post a new announcement
// @access  Private (HR/CEO only)
router.post('/announcements', auth, isHRorCEO, async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const db = getDb();

    const newAnnouncement = {
      title,
      content,
      category: category || 'General', // e.g. 'General', 'Policy', 'Event', 'Urgent'
      author: req.user.name,
      createdAt: new Date().toISOString()
    };

    const result = await db.collection('announcements').insertOne(newAnnouncement);
    newAnnouncement._id = result.insertedId;

    res.status(201).json(newAnnouncement);
  } catch (err) {
    console.error("Create announcement error:", err);
    res.status(500).json({ message: "Server error posting announcement" });
  }
});

// @route   DELETE /api/misc/announcements/:id
// @desc    Delete an announcement
// @access  Private (HR/CEO only)
router.delete('/announcements/:id', auth, isHRorCEO, async (req, res) => {
  const annId = req.params.id;

  if (!ObjectId.isValid(annId)) {
    return res.status(400).json({ message: "Invalid Announcement ID format" });
  }

  try {
    const db = getDb();
    const result = await db.collection('announcements').deleteOne({ _id: new ObjectId(annId) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({ message: "Announcement deleted successfully" });
  } catch (err) {
    console.error("Delete announcement error:", err);
    res.status(500).json({ message: "Server error deleting announcement" });
  }
});

// ==========================================
// Holidays Endpoints
// ==========================================

// @route   GET /api/misc/holidays
// @desc    Get all holidays
// @access  Private
router.get('/holidays', auth, async (req, res) => {
  try {
    const db = getDb();
    // Sort holidays by date ascending
    const holidays = await db.collection('holidays')
      .find()
      .sort({ date: 1 })
      .toArray();
    res.json(holidays);
  } catch (err) {
    console.error("Fetch holidays error:", err);
    res.status(500).json({ message: "Server error fetching holidays" });
  }
});

// @route   POST /api/misc/holidays
// @desc    Add a holiday
// @access  Private (HR/CEO only)
router.post('/holidays', auth, isHRorCEO, async (req, res) => {
  const { name, date, description, type } = req.body;

  if (!name || !date) {
    return res.status(400).json({ message: "Holiday name and date are required" });
  }

  try {
    const db = getDb();

    const newHoliday = {
      name,
      date: new Date(date).toISOString().split('T')[0], // format: YYYY-MM-DD
      description: description || '',
      type: type || 'National', // e.g. 'National', 'Restricted', 'Corporate'
      createdAt: new Date().toISOString()
    };

    const result = await db.collection('holidays').insertOne(newHoliday);
    newHoliday._id = result.insertedId;

    res.status(201).json(newHoliday);
  } catch (err) {
    console.error("Create holiday error:", err);
    res.status(500).json({ message: "Server error creating holiday" });
  }
});

// @route   DELETE /api/misc/holidays/:id
// @desc    Delete a holiday
// @access  Private (HR/CEO only)
router.delete('/holidays/:id', auth, isHRorCEO, async (req, res) => {
  const holId = req.params.id;

  if (!ObjectId.isValid(holId)) {
    return res.status(400).json({ message: "Invalid Holiday ID format" });
  }

  try {
    const db = getDb();
    const result = await db.collection('holidays').deleteOne({ _id: new ObjectId(holId) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Holiday not found" });
    }

    res.json({ message: "Holiday deleted successfully" });
  } catch (err) {
    console.error("Delete holiday error:", err);
    res.status(500).json({ message: "Server error deleting holiday" });
  }
});

// ==========================================
// Departments Endpoints
// ==========================================

// @route   GET /api/misc/departments
// @desc    Get all departments
// @access  Private
router.get('/departments', auth, async (req, res) => {
  try {
    const db = getDb();
    const departments = await db.collection('departments').find().toArray();
    res.json(departments);
  } catch (err) {
    console.error("Fetch departments error:", err);
    res.status(500).json({ message: "Server error fetching departments" });
  }
});

// @route   POST /api/misc/departments
// @desc    Create a new department
// @access  Private (HR/CEO only)
router.post('/departments', auth, isHRorCEO, async (req, res) => {
  const { name, head, budget, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Department name is required" });
  }

  try {
    const db = getDb();
    const newDept = {
      name,
      head: head || '',
      budget: budget || '',
      description: description || '',
      employeesCount: 0,
      createdAt: new Date().toISOString()
    };

    const result = await db.collection('departments').insertOne(newDept);
    newDept.id = result.insertedId.toString(); // Map custom id if frontend relies on string id
    newDept._id = result.insertedId;

    // Update in DB with string id for frontend backward-compatibility
    await db.collection('departments').updateOne({ _id: result.insertedId }, { $set: { id: newDept.id } });

    res.status(201).json(newDept);
  } catch (err) {
    console.error("Create department error:", err);
    res.status(500).json({ message: "Server error creating department" });
  }
});

// @route   PUT /api/misc/departments/:id
// @desc    Update department details
// @access  Private (HR/CEO only)
router.put('/departments/:id', auth, isHRorCEO, async (req, res) => {
  const deptId = req.params.id;

  try {
    const db = getDb();
    let query = { id: deptId };
    if (ObjectId.isValid(deptId)) {
      query = { $or: [{ id: deptId }, { _id: new ObjectId(deptId) }] };
    }

    const updates = {};
    const allowedFields = ['name', 'head', 'budget', 'description', 'employeesCount'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const result = await db.collection('departments').findOneAndUpdate(
      query,
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ message: "Department not found" });
    }

    const updatedDept = result.value || result;
    res.json(updatedDept);
  } catch (err) {
    console.error("Update department error:", err);
    res.status(500).json({ message: "Server error updating department" });
  }
});

// ==========================================
// Projects Endpoints
// ==========================================

// @route   GET /api/misc/projects
// @desc    Get all projects
// @access  Private
router.get('/projects', auth, async (req, res) => {
  try {
    const db = getDb();
    const projects = await db.collection('projects').find().toArray();
    res.json(projects);
  } catch (err) {
    console.error("Fetch projects error:", err);
    res.status(500).json({ message: "Server error fetching projects" });
  }
});

// @route   POST /api/misc/projects
// @desc    Create a new project
// @access  Private (HR/CEO only)
router.post('/projects', auth, isHRorCEO, async (req, res) => {
  const { name, manager, startDate, endDate, progress, status, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Project name is required" });
  }

  try {
    const db = getDb();
    const newProj = {
      name,
      manager: manager || '',
      startDate: startDate || '',
      endDate: endDate || '',
      progress: progress !== undefined ? Number(progress) : 0,
      status: status || 'Planning',
      description: description || '',
      createdAt: new Date().toISOString()
    };

    const result = await db.collection('projects').insertOne(newProj);
    newProj.id = result.insertedId.toString(); // Map custom id if frontend relies on string id
    newProj._id = result.insertedId;

    // Update in DB with string id
    await db.collection('projects').updateOne({ _id: result.insertedId }, { $set: { id: newProj.id } });

    res.status(201).json(newProj);
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ message: "Server error creating project" });
  }
});

// @route   PUT /api/misc/projects/:id
// @desc    Update project details or progress
// @access  Private (HR/CEO only)
router.put('/projects/:id', auth, isHRorCEO, async (req, res) => {
  const projId = req.params.id;

  try {
    const db = getDb();
    let query = { id: projId };
    if (ObjectId.isValid(projId)) {
      query = { $or: [{ id: projId }, { _id: new ObjectId(projId) }] };
    }

    const updates = {};
    const allowedFields = ['name', 'manager', 'startDate', 'endDate', 'progress', 'status', 'description'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'progress') {
          updates[field] = Number(req.body[field]);
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    const result = await db.collection('projects').findOneAndUpdate(
      query,
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updatedProj = result.value || result;
    res.json(updatedProj);
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ message: "Server error updating project" });
  }
});

// ==========================================
// Notifications Endpoints
// ==========================================

// @route   GET /api/misc/notifications
// @desc    Get all notifications for the authenticated user
// @access  Private
router.get('/notifications', auth, async (req, res) => {
  try {
    const db = getDb();
    const notifications = await db.collection('notifications')
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .toArray();
    res.json(notifications);
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({ message: "Server error fetching notifications" });
  }
});

// @route   PUT /api/misc/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
router.put('/notifications/:id/read', auth, async (req, res) => {
  const notifId = req.params.id;

  if (!ObjectId.isValid(notifId)) {
    return res.status(400).json({ message: "Invalid Notification ID format" });
  }

  try {
    const db = getDb();
    const result = await db.collection('notifications').findOneAndUpdate(
      { _id: new ObjectId(notifId), userId: req.user.id },
      { $set: { read: true } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ message: "Notification not found or access denied" });
    }

    const updatedNotif = result.value || result;
    res.json(updatedNotif);
  } catch (err) {
    console.error("Update notification error:", err);
    res.status(500).json({ message: "Server error updating notification" });
  }
});

module.exports = router;
