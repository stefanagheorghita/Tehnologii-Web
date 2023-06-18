
const jwt = require('jsonwebtoken');


function authenticateUser(req, res, next) {
    const authHeader = req.headers.authorization;
    if(authHeader === undefined)
        return -1;
    if (!authHeader) {
      return 0;
    }
    const token = authHeader.split(' ')[2];
    if (!token) {
     return 0;
    }
    try {
      const decodedToken = verifyToken(token);
      req.user = decodedToken;
      return 1;
    } catch (error) {
      return 0;
    }


}



function verifyToken(token) {
    const secretKey = 'your_secret_key_here';
    if(isTokenExpired(token))
        throw new Error('Token expired');
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

    function isTokenExpired(token) {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);
    
      const expirationTime = parsedPayload.exp * 1000; // Convert expiration time to milliseconds
      const currentTime = Date.now();
    
      return expirationTime < currentTime;
    }

    module.exports = {verifyToken,authenticateUser};