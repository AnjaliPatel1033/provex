const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.admin = { id: payload.sub, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Session expired or invalid. Please sign in again.' });
  }
};
