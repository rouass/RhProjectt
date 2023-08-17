const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Bearer token missing' });
    }

    jwt.verify(token, 'p123', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      } else {
        req.user = decoded.user ;
        next(); 
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = authMiddleware;
