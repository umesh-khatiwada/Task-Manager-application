const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Create and send token response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = generateToken({ id: user.id });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: user.toSafeObject(),
  });
};

module.exports = {
  generateToken,
  verifyToken,
  sendTokenResponse,
};
