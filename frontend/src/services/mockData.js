export const mockUsers = [
  { id: '1', email: 'ceo@orbitworks.com', password: 'password', role: 'ceo', name: 'Rajesh Kumar', department: 'Management', designation: 'CEO' },
  { id: '2', email: 'hr@orbitworks.com', password: 'password', role: 'hr', name: 'Pooja Sharma', department: 'Human Resources', designation: 'HR Manager' },
  { id: '3', email: 'rohan@orbitworks.com', password: 'password', role: 'employee', name: 'Rohan Sharma', department: 'Engineering', designation: 'Software Engineer' },
  { id: '4', email: 'vikram@orbitworks.com', password: 'password', role: 'employee', name: 'Vikram Singh', department: 'Engineering', designation: 'Frontend Developer' },
  { id: '5', email: 'priya@orbitworks.com', password: 'password', role: 'employee', name: 'Priya Iyer', department: 'Design', designation: 'UI/UX Designer' }
];

export const mockEmployees = [
  {
    id: 'EMP001',
    userId: '1',
    name: 'Rajesh Kumar',
    department: 'Management',
    designation: 'CEO',
    email: 'ceo@orbitworks.com',
    phone: '9876543210',
    emergencyContact: 'Sunita Kumar (9876543211)',
    joiningDate: '2022-01-15',
    status: 'Active',
    skills: ['Leadership', 'Strategy', 'Finance'],
    documents: [
      { name: 'ceo_agreement.pdf', type: 'offer_letter', uploadDate: '2022-01-15' }
    ]
  },
  {
    id: 'EMP002',
    userId: '2',
    name: 'Pooja Sharma',
    department: 'Human Resources',
    designation: 'HR Manager',
    email: 'hr@orbitworks.com',
    phone: '9123456780',
    emergencyContact: 'Suresh Sharma (9123456781)',
    joiningDate: '2023-03-10',
    status: 'Active',
    skills: ['Recruiting', 'Conflict Resolution', 'Benefits Administration'],
    documents: [
      { name: 'offer_letter_pooja.pdf', type: 'offer_letter', uploadDate: '2023-03-10' },
      { name: 'id_proof_pooja.pdf', type: 'id_proof', uploadDate: '2023-03-10' }
    ]
  },
  {
    id: 'EMP003',
    userId: '3',
    name: 'Rohan Sharma',
    department: 'Engineering',
    designation: 'Software Engineer',
    email: 'rohan@orbitworks.com',
    phone: '9876543220',
    emergencyContact: 'Geeta Sharma (9876543221)',
    joiningDate: '2024-06-01',
    status: 'Active',
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    documents: [
      { name: 'offer_letter_rohan.pdf', type: 'offer_letter', uploadDate: '2024-06-01' },
      { name: 'id_proof_rohan.pdf', type: 'id_proof', uploadDate: '2024-06-01' }
    ]
  },
  {
    id: 'EMP004',
    userId: '4',
    name: 'Vikram Singh',
    department: 'Engineering',
    designation: 'Frontend Developer',
    email: 'vikram@orbitworks.com',
    phone: '9876543230',
    emergencyContact: 'Meera Singh (9876543231)',
    joiningDate: '2025-01-15',
    status: 'Active',
    skills: ['HTML', 'CSS', 'React', 'TypeScript'],
    documents: [
      { name: 'offer_letter_vikram.pdf', type: 'offer_letter', uploadDate: '2025-01-15' }
    ]
  },
  {
    id: 'EMP005',
    userId: '5',
    name: 'Priya Iyer',
    department: 'Design',
    designation: 'UI/UX Designer',
    email: 'priya@orbitworks.com',
    phone: '9876543240',
    emergencyContact: 'Rajesh Iyer (9876543241)',
    joiningDate: '2024-11-20',
    status: 'Active',
    skills: ['Figma', 'Wireframing', 'User Research'],
    documents: [
      { name: 'offer_letter_priya.pdf', type: 'offer_letter', uploadDate: '2024-11-20' }
    ]
  }
];

export const mockDepartments = [
  { id: '1', name: 'Management', head: 'Rajesh Kumar', employeesCount: 1, budget: '$150,000/yr', description: 'Executive steering and company strategy' },
  { id: '2', name: 'Human Resources', head: 'Pooja Sharma', employeesCount: 1, budget: '$80,000/yr', description: 'Employee relations, onboarding, and recruitment' },
  { id: '3', name: 'Engineering', head: 'Rohan Sharma', employeesCount: 2, budget: '$350,000/yr', description: 'Software design, coding, and production support' },
  { id: '4', name: 'Design', head: 'Priya Iyer', employeesCount: 1, budget: '$90,000/yr', description: 'User experience, UI layouts, and branding graphics' }
];

export const mockProjects = [
  { id: 'PRJ001', name: 'OrbitWorks Frontend Re-Skin', manager: 'Pooja Sharma', startDate: '2026-06-01', endDate: '2026-08-15', progress: 75, status: 'Active', description: 'Upgrading employee portal visual styling and performance' },
  { id: 'PRJ002', name: 'Security Audit 2026', manager: 'Rajesh Kumar', startDate: '2026-07-01', endDate: '2026-09-30', progress: 30, status: 'Active', description: 'Annual compliance and authentication hardening protocols' },
  { id: 'PRJ003', name: 'Mobile Application Prototype', manager: 'Rohan Sharma', startDate: '2026-08-01', endDate: '2026-11-30', progress: 0, status: 'Planning', description: 'Drafting mobile app layout blueprints for client demo' }
];

export const mockTasks = [
  {
    id: 'TSK001',
    title: 'Setup skeleton code and context routing',
    description: 'Scaffold main folders, routes setup for authorization, and configure base theme properties in style sheet.',
    priority: 'High',
    status: 'Completed',
    startDate: '2026-07-29',
    deadline: '2026-07-31',
    assignedTo: ['EMP003', 'EMP004'],
    assignedBy: 'EMP001',
    projectName: 'OrbitWorks Frontend Re-Skin',
    attachments: [{ name: 'routing_doc.md', size: '1.2 kb' }],
    expectedOutcome: 'Clean react project compiling with correct routes in App.js',
    comments: [
      { id: 'c1', senderName: 'Rohan Sharma', text: 'Routes configured. Moving to implement components next.', time: '2026-07-30T10:00:00Z' },
      { id: 'c2', senderName: 'Rajesh Kumar', text: 'Looks excellent. Keep up the great speed.', time: '2026-07-30T12:30:00Z' }
    ]
  },
  {
    id: 'TSK002',
    title: 'Implement theme variables and design layout',
    description: 'Configure App.css variables block and map colors inside layout wrappers without using utility framework styles.',
    priority: 'High',
    status: 'In Progress',
    startDate: '2026-07-31',
    deadline: '2026-08-03',
    assignedTo: ['EMP004'],
    assignedBy: 'EMP002',
    projectName: 'OrbitWorks Frontend Re-Skin',
    attachments: [],
    expectedOutcome: 'Complete responsive screen grids containing sidebars, responsive cards, and clean buttons.',
    comments: []
  },
  {
    id: 'TSK003',
    title: 'Review security audit recommendations',
    description: 'Read report sheets and highlight required fixes for JWT token handling processes.',
    priority: 'Critical',
    status: 'Not Started',
    startDate: '2026-08-01',
    deadline: '2026-08-05',
    assignedTo: ['EMP003'],
    assignedBy: 'EMP001',
    projectName: 'Security Audit 2026',
    attachments: [{ name: 'audit_checklist_v1.xlsx', size: '4.8 mb' }],
    expectedOutcome: 'Prioritized action checklist mapping fixes to developer tasks.',
    comments: []
  },
  {
    id: 'TSK004',
    title: 'Design landing page mockup drafts',
    description: 'Draw initial low-fidelity screen visual wireframes for mobile check-in feature interfaces.',
    priority: 'Medium',
    status: 'Under Review',
    startDate: '2026-07-28',
    deadline: '2026-08-01',
    assignedTo: ['EMP005'],
    assignedBy: 'EMP001',
    projectName: 'Mobile Application Prototype',
    attachments: [{ name: 'draft_screens.png', size: '1.4 mb' }],
    expectedOutcome: 'Three wireframe pages uploaded for CEO approvals.',
    comments: [
      { id: 'c3', senderName: 'Priya Iyer', text: 'Uploaded draft. Awaiting comments.', time: '2026-07-29T16:00:00Z' }
    ]
  },
  {
    id: 'TSK005',
    title: 'Onboard engineering interns',
    description: 'Organize introduction materials and share login profiles for orbitworks setups.',
    priority: 'Low',
    status: 'Not Started',
    startDate: '2026-08-05',
    deadline: '2026-08-10',
    assignedTo: ['EMP002'],
    assignedBy: 'EMP001',
    projectName: 'OrbitWorks Frontend Re-Skin',
    attachments: [],
    expectedOutcome: 'Onboarding packet received by target interns.',
    comments: []
  }
];

export const mockAttendance = [
  { id: 'att1', employeeId: 'EMP001', date: '2026-07-31', checkIn: '08:55', checkOut: '17:05', status: 'Present' },
  { id: 'att2', employeeId: 'EMP002', date: '2026-07-31', checkIn: '09:02', checkOut: '17:00', status: 'Present' },
  { id: 'att3', employeeId: 'EMP003', date: '2026-07-31', checkIn: '09:35', checkOut: '', status: 'Late Entry' },
  { id: 'att4', employeeId: 'EMP004', date: '2026-07-31', checkIn: '', checkOut: '', status: 'WFH' },
  { id: 'att5', employeeId: 'EMP005', date: '2026-07-31', checkIn: '', checkOut: '', status: 'Absent' }
];

export const mockLeaveRequests = [
  { id: 'lv1', employeeId: 'EMP003', employeeName: 'Rohan Sharma', leaveType: 'Sick Leave', startDate: '2026-08-10', endDate: '2026-08-12', reason: 'Dental surgery recovery', status: 'Pending', requestedDate: '2026-07-30' },
  { id: 'lv2', employeeId: 'EMP005', employeeName: 'Priya Iyer', leaveType: 'Casual Leave', startDate: '2026-07-25', endDate: '2026-07-26', reason: 'Family gathering function', status: 'Approved', requestedDate: '2026-07-20' },
  { id: 'lv3', employeeId: 'EMP004', employeeName: 'Vikram Singh', leaveType: 'Casual Leave', startDate: '2026-08-15', endDate: '2026-08-18', reason: 'Extended weekend trip', status: 'Pending', requestedDate: '2026-07-31' }
];

export const mockAnnouncements = [
  { id: 'anc1', title: 'Q3 General Town Hall Meeting Scheduled', content: 'Join us on August 5th at 3pm for Q3 status reviews and updates.', category: 'Events', date: '2026-07-31', author: 'Rajesh Kumar' },
  { id: 'anc2', title: 'New Health Policy Rollout Details', content: 'Updated health insurance cards will be mailed to your emergency contacts.', category: 'Policies', date: '2026-07-28', author: 'Pooja Sharma' },
  { id: 'anc3', title: 'Company Holiday Announcement - August 15th', content: 'Offices will remain closed on August 15th for independence day observations.', category: 'Holidays', date: '2026-07-27', author: 'Pooja Sharma' }
];

export const mockHolidays = [
  { id: 'h1', title: 'New Year Day Celebration', date: '2026-01-01', type: 'Public' },
  { id: 'h2', title: 'Spring Annual Festival Day', date: '2026-03-22', type: 'Company' },
  { id: 'h3', title: 'National Independence Day', date: '2026-08-15', type: 'Public' },
  { id: 'h4', title: 'Optional Floating Autumn Leave', date: '2026-10-18', type: 'Optional' }
];

export const mockNotifications = [
  { id: 'n1', userId: '3', text: 'New task assigned to you: Review security audit recommendations', type: 'Task', time: '2026-07-31T09:30:00Z', read: false },
  { id: 'n2', userId: '2', text: 'New leave request submitted by Vikram Singh', type: 'Leave', time: '2026-07-31T10:15:00Z', read: false },
  { id: 'n3', userId: '3', text: 'Your leave request for July 25th has been approved', type: 'Leave', time: '2026-07-26T12:00:00Z', read: true }
];
