const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 20,
  message: "Rate Limit Reached.",
});

module.exports = limiter;
