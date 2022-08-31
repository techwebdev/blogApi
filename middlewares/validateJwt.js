const jsonWebToken = require("jsonwebtoken");

const validateJwt = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "You are not authorized" });
  }
  try {
    jsonWebToken.verify(authorization, process.env.SECRET_KEY);
    next();
  } catch (error) {
    console.log({ error });
    return res.status(400).json({ error: "Token Expired" });
  }
};

module.exports = validateJwt;
