const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { Blog } = require("../models/blog");
const User = require("../models/user");
const helper = require("./test_helper");

const api = supertest(app);

let userToken = null;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const user = { username: "hyjin123", name: "Sean Jin", password: "secret" };

  await api.post("/api/users").send(user);

  const userLogin = await api.post("/api/login").send(user);
  userToken = userLogin.body.token;

  await api
    .post("/api/blogs")
    .send(helper.initialBlogs[0])
    .set({ Authorization: `Bearer ${userToken}` })
    .expect(201);

  await api
    .post("/api/blogs")
    .send(helper.initialBlogs[1])
    .set({ Authorization: `Bearer ${userToken}` })
    .expect(201);
});

describe.only("when there is initially some blogs saved", () => {
  test.only("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test.only("there are two blogs in the database", async () => {
    const response = await helper.blogsInDb();

    assert.strictEqual(response.length, helper.initialBlogs.length);
  });

  test.only("unique identifier is named id", async () => {
    const response = await helper.blogsInDb();

    // filter out all blogs with id property and it should match the number of initialBlog length
    const result = response.filter((blog) => blog.id);

    assert.strictEqual(result.length, helper.initialBlogs.length);
  });
});

describe.only("addition of a new blog", () => {
  test.only("valid blog can be added", async () => {
    const newBlog = {
      title: "I love to go on walks",
      author: "Munjee Jin",
      url: "www.walks.com",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await helper.blogsInDb();

    assert.strictEqual(response.length, helper.initialBlogs.length + 1);

    const contents = response.map((r) => r.title);

    assert(contents.includes("I love to go on walks"));
  });

  test.only("if token is not provided, it fails with 400 status code when adding a blog", async () => {
    const newBlog = {
      title: "I love to go on walks",
      author: "Munjee Jin",
      url: "www.walks.com",
      likes: 5,
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const response = await helper.blogsInDb();

    assert.strictEqual(response.length, helper.initialBlogs.length);
  });

  test.only("like will default to 0 if not specified", async () => {
    const newBlog = {
      title: "I love to go on walks",
      author: "Munjee Jin",
      url: "www.walks.com",
    };

    let likes = null;

    await api
      .post("/api/blogs")
      .send(newBlog)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(201)
      .expect("Content-Type", /application\/json/)
      .expect((response) => {
        // this gets the likes of the posted blog
        likes = response.body.likes;
      });

    // test if added to database
    const response = await helper.blogsInDb();

    assert.strictEqual(response.length, helper.initialBlogs.length + 1);

    // test if likes will default to zero for that specific blog
    assert.strictEqual(likes, 0);
  });

  test.only("if title or url is missing, it doesn't save and responds with 400 status code", async () => {
    const blogWithoutTitle = {
      author: "Munjee Jin",
      url: "www.walks.com",
      likes: 2,
    };

    const blogWithoutUrl = {
      title: "I love golfing!",
      author: "Julia Kim",
      likes: 15,
    };

    await api
      .post("/api/blogs")
      .send(blogWithoutTitle)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(400);

    await api
      .post("/api/blogs")
      .send(blogWithoutUrl)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(400);

    // test that new blog did not get added to database
    const response = await helper.blogsInDb();

    assert.strictEqual(response.length, helper.initialBlogs.length);
  });
});

describe.only("deletion of a blog", () => {
  test.only("succeeds with status code 204 if id is valid for deletion", async () => {
    const blogs = await helper.blogsInDb();
    const blogToDelete = blogs[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ Authorization: `Bearer ${userToken}` })
      .expect(204);

    const response = await helper.blogsInDb();

    assert.strictEqual(response.length, helper.initialBlogs.length - 1);

    const contents = response.map((r) => r.title);

    assert(!contents.includes("Life is up and down"));
  });
});

describe.only("updating a blog", () => {
  test.only("succeeds with status code 204 if id is valid for updating", async () => {
    const blogs = await helper.blogsInDb();
    const blogToUpdate = blogs[0];

    const newBlog = {
      title: "Life is up and down",
      author: "Sean Jin",
      url: "www.google.ca",
      likes: 24,
    };

    let likes = null;

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newBlog)
      .expect(200)
      .expect((response) => {
        likes = response.body.likes;
      });

    assert.strictEqual(likes, 24);
  });
});

after(async () => {
  await mongoose.connection.close();
});
