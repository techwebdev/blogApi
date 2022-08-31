const bcrypt = require("bcrypt");
const sequelizePaginate = require("sequelize-paginate");

const Blog = (sequelize, DataTypes) => {
  const blogSchema = sequelize.define(
    "blog",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["publish", "unpublish"],
      },
    },
    {
      timestamps: true,
      createdAt: "publised_date",
      updatedAt: "modify_date",
    }
  );
  sequelizePaginate.paginate(blogSchema);
  return blogSchema;
};

module.exports = Blog;
