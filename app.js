const express = require("express");
const app = express();
require("express-async-errors");
const { MONGODB_URI } = require("./utils/config");
const { info, error } = require("./utils/logger");
const usersRouter = require("./controllers/users");
const blogsRouter = require("./controllers/blogs");
const cors = require("cors");

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

info("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    info("connected to MongoDB");
  })
  .catch((error) => {
    error("error connection to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/users", usersRouter);
app.use("/api/blogs", blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
