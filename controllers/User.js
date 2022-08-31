const jsonWebToken = require("jsonwebtoken");

const db = require("../models");

const User = db.users;

const register = async (req, res) => {
  const data = req.body;
  try {
    const existingUser = await User.findOne({
      where: {
        email: data.email,
      },
    });
    if (!existingUser) {
      const user = await User.create(data);
      return res.status(200).json({ user });
    } else {
      return res.status(400).json({ error: "Email already exists" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const login = async (req, res) => {
  const data = req.body;
  try {
    const existingUser = await User.findOne({
      where: {
        email: data.email,
      },
    });
    if (existingUser) {
      const isPasswordValid = await existingUser.validPassword(
        data.password,
        existingUser.dataValues.password
      );
      if (isPasswordValid) {
        const jwtToken = jsonWebToken.sign(
          {
            email: existingUser.dataValues.email,
            role: existingUser.dataValues.role,
            id: existingUser.dataValues.id,
          },
          process.env.SECRET_KEY,
          { expiresIn: "12h" }
        );
        return res
          .status(200)
          .json({ email: existingUser.dataValues.email, jwtToken });
      }
      return res.status(400).json({ error: "Password does not match" });
    }
    return res.status(400).json({ error: "User not found" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
};
