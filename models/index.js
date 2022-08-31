"use strict";
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
  })
  .catch((error) => {
    console.error("Error connecting to the database: ", error);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./User")(sequelize, DataTypes);
db.categories = require("./Category")(sequelize, DataTypes);
db.blogs = require("./Blog")(sequelize, DataTypes);

db.categories.hasOne(db.blogs, {
  foreignKey: "category_id",
  as: "blog",
});

db.users.hasMany(db.blogs, {
  foreignKey: "user_id",
  as: "blog",
});

db.blogs.belongsTo(db.users, {
  foreignKey: "user_id",
  as: "user",
});

db.sequelize.sync({ force: false }).then(() => {
  console.log("Data re-synced");
});
module.exports = db;
