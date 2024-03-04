const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("secret", 10);

  const user = new User({
    username: "Sean",
    name: "Sean Jin",
    passwordHash,
  });

  await user.save();
});

test.only("user creation is successfull with a fresh info", async () => {
  const usersAtStart = await helper.usersInDb();

  const newUser = {
    username: "Best",
    name: "Nancy Tran",
    password: "secret",
  };

  await api
    .post("/api/users")
    .send(newUser)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const usersAtEnd = await helper.usersInDb();
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

  const usernames = usersAtEnd.map((u) => u.username);
  assert(usernames.includes(newUser.username));
});

after(async () => {
  await mongoose.connection.close();
});
