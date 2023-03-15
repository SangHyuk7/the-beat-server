require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const AWS = require("aws-sdk");
const connectMongoDB = require("./utils/mongoose");

app.use(cors());
app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const indexRouter = require("./routes/index");

connectMongoDB();

app.use("/api", indexRouter);

app.use(function (req, res, next) {
  const err = new Error("404 Not Found");
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);

  if (!err.status) {
    res.locals.message = "500 Internal Server Error";
    res.stack = "";
  }
});

module.exports = app;