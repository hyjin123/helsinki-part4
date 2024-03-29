const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });

  const formattedUsers = users.map((user) => user.toJSON());

  response.status(201).json(formattedUsers);
});

usersRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  // username requirements are handled by built-in mongoose validation

  // password is required and must be at least 3 lengths long
  if (!password || password.length < 3) {
    return response.status(400).json({
      error:
        "password is required OR password must be at least 3 characters long",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
