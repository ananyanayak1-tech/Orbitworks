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

// @route   GET /api/leaves
// @desc    Get leave requests (Employees view their own, HR/CEO views all)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const db = getDb();
    let query = {};
    
    if (req.user.role !== 'HR' && req.user.role !== 'CEO') {
      query.userId = new ObjectId(req.user.id);
    }

    const leaves = await db.collection('leaves').find(query).sort({ startDate: -1 }).toArray();
    res.json(leaves);
  } catch (err) {
    console.error("Fetch leaves error:", err);
    res.status(500).json({ message: "Server error fetching leave requests" });
  }
});

// @route   POST /api/leaves
// @desc    Create a new leave or WFH request
// @access  Private
router.post('/', auth, async (req, res) => {
  const { type, startDate, endDate, reason } = req.body;

  if (!type || !startDate || !endDate) {
    return res.status(400).json({ message: "Type, startDate, and endDate are required" });
  }

  try {
    const db = getDb();

    // Check employeeId
    if (!req.user.employeeId) {
      const employee = await db.collection('employees').findOne({ userId: new ObjectId(req.user.id) });
      if (employee) {
        req.user.employeeId = employee.id;
      }
    }

    const newRequest = {
      userId: new ObjectId(req.user.id),
      employeeId: req.user.employeeId || "EMP_TEMP",
      name: req.user.name,
      type, // e.g. "WFH", "Sick Leave", "Vacation", "Maternity/Paternity"
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      reason: reason || '',
      status: "Pending", // "Pending", "Approved", "Rejected"
      createdAt: new Date().toISOString()
    };

    const result = await db.collection('leaves').insertOne(newRequest);
    newRequest._id = result.insertedId;

    res.status(201).json(newRequest);
  } catch (err) {
    console.error("Create leave request error:", err);
    res.status(500).json({ message: "Server error submitting leave request" });
  }
});

// @route   PUT /api/leaves/:id
// @desc    Approve or reject a leave request
// @access  Private (HR/CEO only)
router.put('/:id', auth, isHRorCEO, async (req, res) => {
  const leaveId = req.params.id;
  const { status } = req.body; // 'Approved' or 'Rejected'

  if (!ObjectId.isValid(leaveId)) {
    return res.status(400).json({ message: "Invalid Leave Request ID format" });
  }

  if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
    return res.status(400).json({ message: "Valid status ('Approved', 'Rejected', 'Pending') is required" });
  }

  try {
    const db = getDb();

    const result = await db.collection('leaves').findOneAndUpdate(
      { _id: new ObjectId(leaveId) },
      { $set: { status, reviewedBy: req.user.name, reviewedAt: new Date().toISOString() } },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    const updatedLeave = result.value || result;
    res.json(updatedLeave);
  } catch (err) {
    console.error("Update leave request error:", err);
    res.status(500).json({ message: "Server error updating leave request" });
  }
});

// @route   DELETE /api/leaves/:id
// @desc    Cancel/delete a pending leave request
// @access  Private (Self or HR/CEO)
router.delete('/:id', auth, async (req, res) => {
  const leaveId = req.params.id;

  if (!ObjectId.isValid(leaveId)) {
    return res.status(400).json({ message: "Invalid Leave Request ID format" });
  }

  try {
    const db = getDb();
    const leave = await db.collection('leaves').findOne({ _id: new ObjectId(leaveId) });

    if (!leave) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    // Only allow deletion if user is HR/CEO, or is the owner of the leave request AND the status is 'Pending'
    const isOwner = leave.userId.toString() === req.user.id;
    const isPending = leave.status === 'Pending';
    const isAdmin = req.user.role === 'HR' || req.user.role === 'CEO';

    if (!isAdmin && (!isOwner || !isPending)) {
      return res.status(403).json({ message: "Access denied. You can only delete your own pending requests." });
    }

    await db.collection('leaves').deleteOne({ _id: new ObjectId(leaveId) });
    res.json({ message: "Leave request deleted/cancelled successfully" });
  } catch (err) {
    console.error("Delete leave request error:", err);
    res.status(500).json({ message: "Server error deleting leave request" });
  }
});

module.exports = router;
