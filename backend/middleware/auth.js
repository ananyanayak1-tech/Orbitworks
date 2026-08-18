const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Extract token from Authorization header (e.g. "Bearer <token>")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'orbitworks_secret_token_12345');
    req.user = decoded; // Attach the decoded payload (id, email, role, name, employeeId) to the request object
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
