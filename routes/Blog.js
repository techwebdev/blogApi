const BlogController = require("../controllers/Blog");
const router = require("express").Router();
const yup = require("yup");

const blogCreate = yup.object({
  body: yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required "),
    category_id: yup.string().required("Category is required"),
    status: yup
      .mixed()
      .oneOf(["publish", "unpublish"], "Status must be publish or unpublish")
      .required("Status is required"),
  }),
});

const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate({ body: req.body });
    return next();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
router.post("/", validate(blogCreate), BlogController.create);
router.get("/", BlogController.find);
router.put("/:id", BlogController.update);
router.delete("/:id", BlogController.delete);

module.exports = router;
