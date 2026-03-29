const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.json({ msg: "Token Not Found" });

    const token = authHeader.split(" ")[1];
    
    if (!token) return res.json({ msg: "Access Denied" });
    const docecodToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = docecodToken;

    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = authMiddleware;
