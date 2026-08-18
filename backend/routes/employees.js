const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
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

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const db = getDb();
    const employees = await db.collection('employees').aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user_info'
        }
      },
      {
        $unwind: {
          path: '$user_info',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          id: 1,
          name: 1,
          department: 1,
          designation: 1,
          email: 1,
          phone: 1,
          joiningDate: 1,
          status: 1,
          skills: 1,
          assets: 1,
          documents: 1,
          emergencyContact: 1,
          role: '$user_info.role'
        }
      }
    ]).toArray();
    res.json(employees);
  } catch (err) {
    console.error("Fetch employees error:", err);
    res.status(500).json({ message: "Server error fetching employees" });
  }
});

// @route   GET /api/employees/:id
// @desc    Get single employee profile by employee custom ID (e.g. EMP001) or MongoDB ObjectId
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const db = getDb();
    const idParam = req.params.id;
    
    let query = { id: idParam };
    
    // Fallback: check if id is a valid MongoDB ObjectId
    if (ObjectId.isValid(idParam)) {
      query = { $or: [{ id: idParam }, { _id: new ObjectId(idParam) }, { userId: new ObjectId(idParam) }] };
    }

    const employeeArr = await db.collection('employees').aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user_info'
        }
      },
      {
        $unwind: {
          path: '$user_info',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          id: 1,
          name: 1,
          department: 1,
          designation: 1,
          email: 1,
          phone: 1,
          joiningDate: 1,
          status: 1,
          skills: 1,
          assets: 1,
          documents: 1,
          emergencyContact: 1,
          role: '$user_info.role'
        }
      }
    ]).toArray();

    if (employeeArr.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employeeArr[0]);
  } catch (err) {
    console.error("Fetch single employee error:", err);
    res.status(500).json({ message: "Server error fetching employee details" });
  }
});

// @route   POST /api/employees
// @desc    Add a new employee (Creates both User and Employee profiles)
// @access  Private (HR/CEO only)
router.post('/', auth, isHRorCEO, async (req, res) => {
  const {
    id, // e.g. EMP004
    name,
    email,
    password, // initial password
    role, // user role (employee, HR, CEO)
    department,
    designation,
    phone,
    emergencyContact,
    joiningDate,
    status,
    skills,
    assets,
    documents
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  try {
    const db = getDb();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    // Check if custom employee ID already exists
    if (id) {
      const existingEmployee = await db.collection('employees').findOne({ id: id });
      if (existingEmployee) {
        return res.status(400).json({ message: `Employee ID ${id} already exists` });
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 1. Insert into users collection
    const userRole = role || 'employee';
    const userResult = await db.collection('users').insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole,
      name
    });

    // 2. Insert into employees collection
    const newEmployee = {
      userId: userResult.insertedId,
      id: id || `EMP${Math.floor(100 + Math.random() * 900)}`,
      name,
      department: department || 'Engineering',
      designation: designation || 'Software Engineer',
      email: email.toLowerCase(),
      phone: phone || '',
      emergencyContact: emergencyContact || '',
      joiningDate: joiningDate ? new Date(joiningDate).toISOString() : new Date().toISOString(),
      status: status || 'Active',
      skills: skills || [],
      assets: assets || [],
      documents: documents || []
    };

    const employeeResult = await db.collection('employees').insertOne(newEmployee);
    
    // Attach MongoDB _id to payload response
    newEmployee._id = employeeResult.insertedId;

    res.status(201).json({
      message: "Employee profile and user login created successfully",
      employee: newEmployee
    });

  } catch (err) {
    console.error("Create employee error:", err);
    res.status(500).json({ message: "Server error creating employee" });
  }
});

// @route   PUT /api/employees/:id
// @desc    Update employee profile (e.g. status, skills, assets, documents)
// @access  Private (HR/CEO or self)
router.put('/:id', auth, async (req, res) => {
  const idParam = req.params.id;

  try {
    const db = getDb();
    
    let query = { id: idParam };
    if (ObjectId.isValid(idParam)) {
      query = { $or: [{ id: idParam }, { _id: new ObjectId(idParam) }] };
    }

    const employee = await db.collection('employees').findOne(query);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check permissions: HR/CEO can update anyone, otherwise user can only update their own profile
    if (req.user.role !== 'HR' && req.user.role !== 'CEO' && req.user.id !== employee.userId.toString()) {
      return res.status(403).json({ message: "Access denied. You can only update your own profile." });
    }

    // Filter fields that can be updated
    const updates = {};
    const allowedFields = ['name', 'department', 'designation', 'phone', 'joiningDate', 'status', 'skills', 'assets', 'documents', 'emergencyContact'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Update in employees
    await db.collection('employees').updateOne(query, { $set: updates });

    // If name is updated, also update in users collection
    if (updates.name) {
      await db.collection('users').updateOne(
        { _id: employee.userId },
        { $set: { name: updates.name } }
      );
    }

    // If role is updated, also update role in users collection
    if (req.body.role) {
      await db.collection('users').updateOne(
        { _id: employee.userId },
        { $set: { role: req.body.role } }
      );
    }

    const updatedEmployee = await db.collection('employees').findOne(query);
    res.json({ message: "Profile updated successfully", employee: updatedEmployee });

  } catch (err) {
    console.error("Update employee error:", err);
    res.status(500).json({ message: "Server error updating employee" });
  }
});

// @route   DELETE /api/employees/:id
// @desc    Delete employee (HR/CEO only)
// @access  Private (HR/CEO only)
router.delete('/:id', auth, isHRorCEO, async (req, res) => {
  const idParam = req.params.id;

  try {
    const db = getDb();
    
    let query = { id: idParam };
    if (ObjectId.isValid(idParam)) {
      query = { $or: [{ id: idParam }, { _id: new ObjectId(idParam) }] };
    }

    const employee = await db.collection('employees').findOne(query);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Delete from employees
    await db.collection('employees').deleteOne(query);

    // Delete corresponding user
    await db.collection('users').deleteOne({ _id: employee.userId });

    res.json({ message: "Employee and user credentials deleted successfully" });

  } catch (err) {
    console.error("Delete employee error:", err);
    res.status(500).json({ message: "Server error deleting employee" });
  }
});

module.exports = router;
