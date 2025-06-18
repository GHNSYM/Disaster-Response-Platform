const authenticate = (req, res, next) => {
  // In a real application, this would involve JWT verification or similar.
  // For now, a mock authentication based on hardcoded users.
  const allowedUsers = ['netrunnerX', 'reliefAdmin', 'test_user'];
  const userId = req.headers['x-user-id']; // Assuming user ID is passed in a custom header

  if (userId && allowedUsers.includes(userId)) {
    req.user = { id: userId, role: userId === 'reliefAdmin' ? 'admin' : 'contributor' };
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid or missing user ID' });
  }
};

const authorize = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
  }
  next();
};

module.exports = {
  authenticate,
  authorize,
}; 