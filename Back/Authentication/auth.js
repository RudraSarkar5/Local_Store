const jwt = require("jsonwebtoken");
const secretKey = "rudrasarkarr";
const getToken = (user) => {
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, secretKey);
  return token;
};
const validateToken = (token) => {
  const payload = jwt.verify(token, secretKey);
  return payload;
};

module.exports = {
  getToken,
  validateToken,
  secretKey,
};
