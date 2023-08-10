const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    // Get the token from the 'Authorization' header
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    // Check if the header contains the 'Bearer' scheme
    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Bearer token missing' });
    }

    // Verify the token
    jwt.verify(token, 'p123', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      } else {
        // If token is valid, attach the user ID to req.user.id
        req.user = decoded.user;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = authMiddleware;
