const { validateToken } = require("../service/authentication");

// Middleware to check authentication from a cookie
function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const token = req.cookies[cookieName]; // get token from cookies
    if (!token) return next(); // no token => user not signed in
    try {
      const userPayload = validateToken(token); // validate JWT
      req.user = userPayload; // attach user info to request
    } catch (error) {
      // invalid token, do nothing and continue
    }
    return next(); // proceed to next middleware/route
  };
}

module.exports = { checkForAuthenticationCookie };
