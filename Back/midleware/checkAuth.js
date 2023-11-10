const User = require("../Model/user");
const { validateToken, secretKey } = require("../Authentication/auth");

const checkAuthentification = (cookieName) => {
  return async (req, res, next) => {
    const token = req.cookies[cookieName];

    if (!token) {
      return res.status(400).json({ error: "Login or sign up first" });
    }

    const userId = validateToken(token, secretKey);

    const user = await User.find({ email: userId.email });
    if (!user) {
      return res.status(400).json({ err: "login or sign up first" });
    }
    next();
  };
};

module.exports = {
  checkAuthentification,
};
