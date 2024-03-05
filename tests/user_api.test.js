const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

describe.only("when there is initially one user in db", () => {
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

  test.only("username is required", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      name: "Nancy Tran",
      password: "secret",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert(result.body.error.includes("`username` is required"));
  });

  test.only("username needs to be unique", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Sean",
      name: "Nancy Tran",
      password: "secret",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert(result.body.error.includes("expected `username` to be unique"));
  });

  test.only("username needs to be 3 characters long", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Hi",
      name: "Nancy Tran",
      password: "secret",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert(
      result.body.error.includes("shorter than the minimum allowed length (3)")
    );
  });

  test.only("password is required", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Best",
      name: "Nancy Tran",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert(result.body.error.includes("password is required"));
  });

  test.only("password needs to be 3 characters long", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "Best",
      name: "Nancy Tran",
      password: "Hi",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
    assert(
      result.body.error.includes("password must be at least 3 characters long")
    );
  });
});

after(async () => {
  await mongoose.connection.close();
});
