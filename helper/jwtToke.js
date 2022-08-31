const jwtToken = require("jsonwebtoken");

const decodeToken = async (req) => {
  const { authorization } = req.headers;

  return jwtToken.decode(authorization);
};
module.exports = {
  decodeToken,
};
