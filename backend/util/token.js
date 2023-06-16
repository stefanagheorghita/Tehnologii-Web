
const jwt = require('jsonwebtoken');


function verifyToken(token) {
    const secretKey = 'your_secret_key_here';
    try {
      const decodedToken = jwt.verify(token, secretKey);
      
      if (!decodedToken || !decodedToken.id) {
        throw new Error('Invalid token structure');
      }
      return decodedToken;
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            if (error.name === 'TokenExpiredError') {
              throw new Error('Token expired');
            } else if (error.name === 'JsonWebTokenError') {
              throw new Error('Invalid token signature');
            } else {
              throw new Error('Invalid token');
            }
          } else {
            throw error;
          }
        }
    }

    module.exports = {verifyToken};