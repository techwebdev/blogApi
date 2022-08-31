const bcrypt = require("bcrypt");

const Category = (sequelize, DataTypes) => {
  return sequelize.define("category", {
    name: {
      type: DataTypes.STRING,
    },
  });
};

module.exports = Category;
