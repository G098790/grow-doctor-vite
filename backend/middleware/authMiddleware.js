const jwt = require("jsonwebtoken");

/**
 * Protects routes by verifying a Bearer JWT issued by
 * controllers/authController.js (login/register).
 *
 * Token payload shape: { id: <userId>, email: <userEmail> }
 * Sets req.user = { id, email } on success so cart/order
 * controllers can use req.user.id.
 */
const protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid or expired",
    });
  }
};

module.exports = { protect };
