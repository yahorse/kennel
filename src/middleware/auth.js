// Placeholder authentication middleware.
// In a production application replace with JWT or session validation.

export const mockClientAuth = (req, res, next) => {
  const userId = req.headers['x-user-id'] ?? '000000000000000000000001';
  const role = req.headers['x-user-role'] ?? 'client';
  req.user = { _id: userId, role };
  next();
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    res.status(403);
    next(new Error('Admin access required'));
    return;
  }
  next();
};
