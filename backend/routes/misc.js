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

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Helper to generate a secure verification token for each request
const getDemoVerificationToken = (id) => {
  return crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'orbitworks-demo-secret-key-2026')
    .update(id.toString())
    .digest('hex');
};

// HTML Template helper for response pages (Approved / Denied confirmation screen)
const renderApprovalResponsePage = (title, message, isSuccess) => {
  const themeColor = isSuccess ? '#10B981' : '#EF4444';
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&family=Manrope:wght@800&display=swap" rel="stylesheet">
        <style>
          body {
            background-color: #F4F7F5;
            font-family: 'IBM Plex Sans', sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
          .card {
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.06);
            border: 1px solid rgba(0,0,0,0.04);
            padding: 3rem 2.5rem;
            max-width: 450px;
            width: 100%;
            text-align: center;
            box-sizing: border-box;
          }
          h1 {
            font-family: 'Manrope', sans-serif;
            font-weight: 800;
            color: #102A43;
            margin-top: 0;
            font-size: 1.75rem;
            letter-spacing: -0.5px;
          }
          p {
            color: #526579;
            line-height: 1.5;
            font-size: 0.95rem;
            margin-bottom: 2rem;
          }
          .status-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: ${isSuccess ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
            color: ${themeColor};
            font-size: 2rem;
            margin-bottom: 1.5rem;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="status-icon">${isSuccess ? '✓' : '✗'}</div>
          <h1>${title}</h1>
          <p>${message}</p>
          <span style="font-size: 0.8rem; color: #9FB3C8; display: block; margin-top: 1.5rem;">OrbitWorks Coordination Engine</span>
        </div>
      </body>
    </html>
  `;
};

// @route   POST /api/misc/demo-requests
// @desc    Submit a new demo request (Public)
// @access  Public
router.post('/demo-requests', async (req, res) => {
  const { firstName, lastName, email, companyName, phone, message } = req.body;

  if (!firstName || !lastName || !email || !companyName) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const db = getDb();
    const newRequest = {
      firstName,
      lastName,
      email,
      companyName,
      phone: phone || '',
      message: message || '',
      status: 'pending', // 'pending', 'approved', 'rejected'
      createdAt: new Date().toISOString()
    };

    const result = await db.collection('demo_requests').insertOne(newRequest);
    const requestId = result.insertedId;
    newRequest._id = requestId;

    // Secure Verification Token
    const secureToken = getDemoVerificationToken(requestId);

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const adminEmail = process.env.ADMIN_EMAIL || 'ceo@orbitworks.com';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort) || 587,
        secure: smtpPort == 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      // Actions inside the email pointing to backend approval endpoints
      const approveLink = `${backendUrl}/api/misc/demo-requests/approve/${requestId}?token=${secureToken}`;
      const rejectLink = `${backendUrl}/api/misc/demo-requests/reject/${requestId}?token=${secureToken}`;

      const mailOptions = {
        from: `"OrbitWorks Demo Alerts" <${smtpUser}>`,
        to: adminEmail,
        subject: `New Demo Access Request: ${companyName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e8ed; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #102A43; margin-top: 0;">New Demo Access Request</h2>
            <p style="color: #4a5568; line-height: 1.5;">You received a request for a custom demo walk from <strong>${companyName}</strong>.</p>
            
            <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="color: #718096; width: 120px; padding: 4px 0;"><strong>Name:</strong></td>
                  <td style="color: #2d3748;">${firstName} ${lastName}</td>
                </tr>
                <tr>
                  <td style="color: #718096; padding: 4px 0;"><strong>Email:</strong></td>
                  <td style="color: #2d3748;">${email}</td>
                </tr>
                <tr>
                  <td style="color: #718096; padding: 4px 0;"><strong>Company:</strong></td>
                  <td style="color: #2d3748;">${companyName}</td>
                </tr>
                <tr>
                  <td style="color: #718096; padding: 4px 0;"><strong>Phone:</strong></td>
                  <td style="color: #2d3748;">${phone || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style="color: #718096; vertical-align: top; padding: 4px 0;"><strong>Message:</strong></td>
                  <td style="color: #2d3748; line-height: 1.4;">${message || 'No message provided.'}</td>
                </tr>
              </table>
            </div>

            <p style="color: #4a5568; margin-bottom: 25px;">Please review the client request details and decide whether to approve access to the OrbitWorks workspace demo:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 25px 0;">
              <tr>
                <td style="width: 48%; padding-right: 12px;">
                  <a href="${approveLink}" style="display: block; background-color: #10B981; color: #ffffff; padding: 12px 18px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; text-align: center; box-sizing: border-box;">
                    Approve Access
                  </a>
                </td>
                <td style="width: 48%; padding-left: 12px;">
                  <a href="${rejectLink}" style="display: block; background-color: #EF4444; color: #ffffff; padding: 12px 18px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; text-align: center; box-sizing: border-box;">
                    Deny Access
                  </a>
                </td>
              </tr>
            </table>

            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <span style="color: #a0aec0; font-size: 12px; display: block; text-align: center;">OrbitWorks Integration Engine · Automated Notifications</span>
          </div>
        `
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error("Nodemailer mail sending error:", err);
        } else {
          console.log("Nodemailer mail sent successfully:", info.response);
        }
      });
    } else {
      console.log("SMTP environment credentials not found. Skipping email alerts.");
    }

    res.status(201).json({ message: "Demo request submitted successfully", request: newRequest });
  } catch (err) {
    console.error("Submit demo request error:", err);
    res.status(500).json({ message: "Server error submitting demo request" });
  }
});

// @route   GET /api/misc/demo-requests/approve/:id
// @desc    Approve access trigger via email (Public url with secure token check)
// @access  Public (Verification-driven)
router.get('/demo-requests/approve/:id', async (req, res) => {
  const requestId = req.params.id;
  const { token } = req.query;

  if (!ObjectId.isValid(requestId)) {
    return res.status(400).send(renderApprovalResponsePage('Invalid Request', 'The request ID format is invalid.', false));
  }

  // Validate Token Integrity
  const expectedToken = getDemoVerificationToken(requestId);
  if (token !== expectedToken) {
    return res.status(403).send(renderApprovalResponsePage('Access Forbidden', 'The verification token is invalid or expired.', false));
  }

  try {
    const db = getDb();
    const existing = await db.collection('demo_requests').findOne({ _id: new ObjectId(requestId) });
    if (!existing) {
      return res.status(404).send(renderApprovalResponsePage('Request Not Found', 'The demo request could not be located.', false));
    }

    // State Locking Checks
    if (existing.status === 'approved') {
      return res.send(renderApprovalResponsePage(
        'Already Approved', 
        `The demo request from <strong>${existing.firstName} ${existing.lastName} (${existing.companyName})</strong> has already been approved previously.`, 
        true
      ));
    }
    if (existing.status === 'rejected') {
      return res.send(renderApprovalResponsePage(
        'Action Blocked', 
        `This request has already been declined and cannot be approved.`, 
        false
      ));
    }

    // Set Approved status
    await db.collection('demo_requests').updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: 'approved' } }
    );

    // Conceptually, send confirmation email back to the prospect
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT == 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });
      const googleMeetLink = process.env.GOOGLE_MEET_LINK || 'https://meet.google.com/new';

      const clientMailOptions = {
        from: `"OrbitWorks Support" <${smtpUser}>`,
        to: existing.email,
        subject: `OrbitWorks Demo Approved! Let's schedule a call`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e8ed; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #102A43; margin-top: 0;">Demo Request Approved!</h2>
            <p style="color: #2d3748; font-size: 15px; line-height: 1.6;">Hi ${existing.firstName},</p>
            <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">We are excited to let you know that your demo request for <strong>OrbitWorks</strong> has been approved!</p>
            
            <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">Instead of just sending standard sandbox credentials, we would love to invite you to a personalized, 1-on-1 walkthrough via <strong>Google Meet</strong>. This allows us to tailor the demo to your specific team workflows, show you custom features, and answer any integration questions you have.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${googleMeetLink}" target="_blank" style="display: inline-block; background-color: #087E8B; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px; box-shadow: 0 4px 12px rgba(8, 126, 139, 0.2); vertical-align: middle;">
                <span style="vertical-align: middle;">Schedule Live Demo Walk (Google Meet)</span>
                <img src="https://img.icons8.com/material-outlined/24/ffffff/calendar--v1.png" width="16" height="16" style="vertical-align: middle; margin-left: 8px; display: inline-block;" alt="Calendar" />
              </a>
            </div>

            <p style="color: #4a5568; font-size: 14px; line-height: 1.6;">If you have a preferred scheduler link (like Calendly) or specific time slots that work best for you, please reply directly to this email.</p>
            
            <p style="color: #2d3748; font-size: 15px; font-weight: bold; margin-top: 25px; margin-bottom: 5px;">Best regards,</p>
            <p style="color: #4a5568; font-size: 15px; margin: 0; font-weight: 600;">Team OrbitWorks</p>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <span style="color: #a0aec0; font-size: 12px; display: block; text-align: center;">OrbitWorks Coordination Suite · Personalised Walkthroughs</span>
          </div>
        `
      };

      transporter.sendMail(clientMailOptions, (err) => {
        if (err) console.error("Client approve email dispatch failed:", err);
      });
    }

    res.send(renderApprovalResponsePage(
      'Demo Access Approved', 
      `The demo request from <strong>${existing.firstName} ${existing.lastName} (${existing.companyName})</strong> has been successfully approved. An automated welcome email inviting them to a live Google Meet walk has been sent to <strong>${existing.email}</strong>.`,
      true
    ));
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).send(renderApprovalResponsePage('Server Error', 'An unexpected error occurred during database update.', false));
  }
});

// @route   GET /api/misc/demo-requests/reject/:id
// @desc    Reject access trigger via email (Public url with secure token check)
// @access  Public (Verification-driven)
router.get('/demo-requests/reject/:id', async (req, res) => {
  const requestId = req.params.id;
  const { token } = req.query;

  if (!ObjectId.isValid(requestId)) {
    return res.status(400).send(renderApprovalResponsePage('Invalid Request', 'The request ID format is invalid.', false));
  }

  // Validate Token Integrity
  const expectedToken = getDemoVerificationToken(requestId);
  if (token !== expectedToken) {
    return res.status(403).send(renderApprovalResponsePage('Access Forbidden', 'The verification token is invalid or expired.', false));
  }

  try {
    const db = getDb();
    const existing = await db.collection('demo_requests').findOne({ _id: new ObjectId(requestId) });
    if (!existing) {
      return res.status(404).send(renderApprovalResponsePage('Request Not Found', 'The demo request could not be located.', false));
    }

    // State Locking Checks
    if (existing.status === 'approved') {
      return res.send(renderApprovalResponsePage(
        'Action Blocked', 
        `This request has already been approved and cannot be declined.`, 
        false
      ));
    }
    if (existing.status === 'rejected') {
      return res.send(renderApprovalResponsePage(
        'Already Declined', 
        `The demo request from <strong>${existing.firstName} ${existing.lastName} (${existing.companyName})</strong> has already been declined previously.`, 
        false
      ));
    }

    // Set Rejected status
    await db.collection('demo_requests').updateOne(
      { _id: new ObjectId(requestId) },
      { $set: { status: 'rejected' } }
    );

    // Send polite rejection email to the client
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT == 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const clientMailOptions = {
        from: `"OrbitWorks Support" <${smtpUser}>`,
        to: existing.email,
        subject: `OrbitWorks Demo Request Update`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e8ed; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #102A43; margin-top: 0;">Demo Request Update</h2>
            <p style="color: #2d3748; font-size: 15px; line-height: 1.6;">Hi ${existing.firstName},</p>
            <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">Thank you for your interest in <strong>OrbitWorks</strong>. We appreciate you taking the time to submit a request for a live demo walk.</p>
            
            <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">Unfortunately, we are unable to accommodate your request for a tailored demo walkthrough at this time due to high request volumes and limited availability slots.</p>
            
            <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">We will retain your details and contact you if slot schedules open up in the future.</p>
            
            <p style="color: #2d3748; font-size: 15px; font-weight: bold; margin-top: 25px; margin-bottom: 5px;">Best regards,</p>
            <p style="color: #4a5568; font-size: 15px; margin: 0; font-weight: 600;">Team OrbitWorks</p>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <span style="color: #a0aec0; font-size: 12px; display: block; text-align: center;">OrbitWorks Coordination Suite · Support Operations</span>
          </div>
        `
      };

      transporter.sendMail(clientMailOptions, (err) => {
        if (err) console.error("Client reject email dispatch failed:", err);
      });
    }

    res.send(renderApprovalResponsePage(
      'Demo Request Denied', 
      `The demo request from <strong>${existing.firstName} ${existing.lastName} (${existing.companyName})</strong> has been declined. A polite notification email has been sent to <strong>${existing.email}</strong>.`,
      false
    ));
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).send(renderApprovalResponsePage('Server Error', 'An unexpected error occurred during database update.', false));
  }
});

module.exports = router;
