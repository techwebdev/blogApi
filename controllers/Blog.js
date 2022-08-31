const moment = require("moment");

const { decodeToken } = require("../helper/jwtToke");
const db = require("../models");

const Blog = db.blogs;
const Category = db.categories;
const { Op } = db.sequelize;
const create = async (req, res) => {
  const data = req.body;
  const userData = await decodeToken(req);
  const category = await Category.findOne({ where: { id: data?.category_id } });
  if (!category) {
    return res.status(400).json({ error: "Category not found" });
  }
  try {
    data["user_id"] = userData.id;
    const blogCreate = await Blog.create(data);
    return res.status(200).json({ data: blogCreate });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const find = async (req, res) => {
  const userData = await decodeToken(req);
  const query = req.query;
  const page = query.page || 1;
  const limit = query?.limit || 10;

  
  try {
    let filterData = {
      paginate: limit,
      page,
    };
    if (query?.user) {
      filterData = {
        ...filterData,
        where: {
          user_id: query?.user,
        },
      };
    }
    if (query?.category) {
      const category = await Category.findOne({
        where: { id: query?.category },
      });
      if (category) {
        filterData = {
          ...filterData,
          where: {
            category_id: query?.category,
          },
        };
      }
    }
    if (userData.role === "user") {
      filterData = {
        where: { ...(filterData?.["where"] || {}), user_id: userData.id },
      };
    }

    const blogs = await Blog.paginate(filterData);
    return res.status(200).json({ data: { ...blogs, page: +page } });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
const update = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const userData = await decodeToken(req);
  const blog = await Blog.findOne({
    where: { id },
  });

  if (
    blog &&
    (userData.role === "admin" || blog.dataValues.user_id === userData.id)
  ) {
    data["user_id"] = blog?.user_id || userData.id;
    if (data?.category_id) {
      const category = await Category.findOne({
        where: { id: data?.category_id },
      });
      if (!category) {
        return res.status(400).json({ error: "Category not found" });
      }
    }
    try {
      const blogUpdate = await Blog.update(data, { where: { id } });
      return res.status(200).json({ data: blogUpdate });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  return res.status(400).json({ error: "Blog not found" });
};

const deleteBlog = async (req, res) => {
  const id = req.params.id;
  const userData = await decodeToken(req);
  const blog = await Blog.findOne({
    where: { id },
  });

  if (
    blog &&
    (userData.role === "admin" || blog.dataValues.user_id === userData.id)
  ) {
    try {
      await Blog.destroy({ where: { id } });
      return res.status(200).json({ data: "Blog Deleted" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  return res.status(400).json({ error: "Blog not found" });
};

module.exports = {
  create,
  find,
  update,
  delete: deleteBlog,
};
