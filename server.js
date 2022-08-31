require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const app = express();
const userRouter = require("./routes/User");
const blogRouter = require("./routes/Blog");
const validateJwt = require("./middlewares/validateJwt");
// Json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Cors
app.use(cors());

app.use("/auth", userRouter);
app.use("/blog", validateJwt, blogRouter);

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  return res.json({ hello: "Hello World" });
});

app.listen(port, () => {
  console.log(`App Running on port ${port}`);
});
