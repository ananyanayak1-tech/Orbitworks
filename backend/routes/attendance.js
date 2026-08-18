const express = require('express');
const router = express.Router();
const { getDb } = require('../config/db');
const auth = require('../middleware/auth');
const { ObjectId } = require('mongodb');

// Helper to get today's date in YYYY-MM-DD format based on a given timezone offset or UTC
const getLocalDateString = (date = new Date()) => {
  // Pad single digits
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// @route   GET /api/attendance
// @desc    Get attendance logs for a specific date (defaults to today)
// @access  Private
router.get('/', auth, async (req, res) => {
  const { date } = req.query;
  const targetDate = date || getLocalDateString();

  try {
    const db = getDb();
    
    // Find all attendance records for the target date
    const query = { date: targetDate };
    
    // If the user is a standard employee, they should only see their own logs
    // unless they are HR/CEO, who can view everyone's log
    if (req.user.role !== 'HR' && req.user.role !== 'CEO') {
      query.userId = new ObjectId(req.user.id);
    }

    const logs = await db.collection('attendance').find(query).toArray();
    res.json(logs);
  } catch (err) {
    console.error("Fetch attendance error:", err);
    res.status(500).json({ message: "Server error fetching attendance logs" });
  }
});

// @route   GET /api/attendance/my-history
// @desc    Get the current user's check-in history
// @access  Private
router.get('/my-history', auth, async (req, res) => {
  try {
    const db = getDb();
    const history = await db.collection('attendance')
      .find({ userId: new ObjectId(req.user.id) })
      .sort({ date: -1 })
      .toArray();
    res.json(history);
  } catch (err) {
    console.error("Fetch attendance history error:", err);
    res.status(500).json({ message: "Server error fetching history" });
  }
});

// @route   POST /api/attendance/check-in
// @desc    Record present check-in
// @access  Private
router.post('/check-in', auth, async (req, res) => {
  const todayStr = getLocalDateString();

  try {
    const db = getDb();

    // Check if employeeId is associated with this user
    if (!req.user.employeeId) {
      // Find the employee profile to get the custom employee ID if missing in token
      const employee = await db.collection('employees').findOne({ userId: new ObjectId(req.user.id) });
      if (employee) {
        req.user.employeeId = employee.id;
      }
    }

    // Check if already checked in today
    const existingLog = await db.collection('attendance').findOne({
      userId: new ObjectId(req.user.id),
      date: todayStr
    });

    if (existingLog) {
      return res.status(400).json({ message: "Already checked in for today", log: existingLog });
    }

    const newLog = {
      userId: new ObjectId(req.user.id),
      employeeId: req.user.employeeId || "EMP_TEMP",
      name: req.user.name,
      date: todayStr,
      checkIn: new Date().toISOString(),
      checkOut: null,
      status: "Present"
    };

    const result = await db.collection('attendance').insertOne(newLog);
    newLog._id = result.insertedId;

    res.status(201).json({ message: "Checked in successfully", log: newLog });
  } catch (err) {
    console.error("Check-in error:", err);
    res.status(500).json({ message: "Server error during check-in" });
  }
});

// @route   POST /api/attendance/check-out
// @desc    Record check-out time
// @access  Private
router.post('/check-out', auth, async (req, res) => {
  const todayStr = getLocalDateString();

  try {
    const db = getDb();

    // Find today's check-in log that hasn't checked out yet
    const existingLog = await db.collection('attendance').findOne({
      userId: new ObjectId(req.user.id),
      date: todayStr,
      checkOut: null
    });

    if (!existingLog) {
      // Check if they checked in and already checked out
      const completedLog = await db.collection('attendance').findOne({
        userId: new ObjectId(req.user.id),
        date: todayStr
      });

      if (completedLog && completedLog.checkOut) {
        return res.status(400).json({ message: "Already checked out for today", log: completedLog });
      }

      return res.status(400).json({ message: "No active check-in record found for today. Please check-in first." });
    }

    const checkOutTime = new Date().toISOString();

    await db.collection('attendance').updateOne(
      { _id: existingLog._id },
      { $set: { checkOut: checkOutTime } }
    );

    const updatedLog = {
      ...existingLog,
      checkOut: checkOutTime
    };

    res.json({ message: "Checked out successfully", log: updatedLog });
  } catch (err) {
    console.error("Check-out error:", err);
    res.status(500).json({ message: "Server error during check-out" });
  }
});

// @route   POST /api/attendance/manual
// @desc    Manually override/create an attendance record (HR/CEO only)
// @access  Private (HR/CEO only)
router.post('/manual', auth, async (req, res) => {
  if (req.user.role !== 'HR' && req.user.role !== 'CEO') {
    return res.status(403).json({ message: "Access denied. HR or CEO permissions required." });
  }

  const { employeeId, date, status, checkIn, checkOut } = req.body;

  if (!employeeId || !date) {
    return res.status(400).json({ message: "Employee ID and date are required" });
  }

  try {
    const db = getDb();

    // Check if the record already exists for the given employee on that date
    const query = { employeeId, date };
    const existingLog = await db.collection('attendance').findOne(query);

    if (existingLog) {
      const updates = { status, checkIn: checkIn || '', checkOut: checkOut || '' };
      await db.collection('attendance').updateOne(query, { $set: updates });
      const updatedLog = await db.collection('attendance').findOne(query);
      return res.json(updatedLog);
    } else {
      // Find employee details to get their user name
      const employee = await db.collection('employees').findOne({ id: employeeId });
      const newLog = {
        userId: employee ? employee.userId : null,
        employeeId,
        name: employee ? employee.name : 'Unknown',
        date,
        checkIn: checkIn || '',
        checkOut: checkOut || '',
        status: status || 'Present'
      };
      const result = await db.collection('attendance').insertOne(newLog);
      newLog._id = result.insertedId;
      return res.status(201).json(newLog);
    }
  } catch (err) {
    console.error("Manual attendance error:", err);
    res.status(500).json({ message: "Server error marking attendance manually" });
  }
});

module.exports = router;
