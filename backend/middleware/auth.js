import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { jsonDb } from '../data/jsonDb.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey1234567890abcdef');

      // Get user from database/JSON DB
      if (global.useLocalJSONDb) {
        const user = jsonDb.findUserById(decoded.id);
        if (!user) {
          return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
        // Exclude password from the req.user object
        const { password, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};
