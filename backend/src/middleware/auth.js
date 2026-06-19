import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-oilfund-key-2026';

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    // Fallback for mock/demo tokens if required
    if (token.startsWith('mock-jwt-token-')) {
      const rawToken = token.replace('mock-jwt-token-', '');
      const parts = rawToken.split('-');
      const userId = parts.slice(0, 5).join('-');
      const phone = parts.slice(5).join('-');
      req.user = { id: userId, phone };
      return next();
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Contains { id, phone }
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired session token' });
    }
  } catch (error) {
    next(error);
  }
};

export default authenticateUser;
