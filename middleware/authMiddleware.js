import jwt from 'jsonwebtoken';

// Middleware to verify JWT token
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Bearer

  if (!token) return res.status(401).json({ message: 'Not Authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode token
    req.user = decoded; // Attach decoded token data to request
    next(); // Proceed to the next middleware or route
  } catch (error) {
    res.status(401).json({ message: 'Token expired or invalid' });
  }
};

// Middleware to check user roles for specific routes
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized for this role' });
    }
    next(); // Proceed if role is authorized
  };
};
