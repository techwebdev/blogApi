const UserController = require("../controllers/User");
const router = require("express").Router();
const yup = require("yup");

const userCreate = yup.object({
  body: yup.object({
    firstName: yup.string().required("FirstName is required"),
    lastName: yup.string().required("LastName is required "),
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
    dob: yup.date().required("Date of birth is required"),
    role: yup.string().required("Role is required"),
  }),
});

const userLogin = yup.object({
  body: yup.object({
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
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
router.post("/register", validate(userCreate), UserController.register);
router.post("/login", validate(userLogin), UserController.login);

module.exports = router;
