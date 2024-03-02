const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { Blog } = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

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
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await helper.blogsInDb();

  assert.strictEqual(response.length, helper.initialBlogs.length + 1);

  const contents = response.map((r) => r.title);

  assert(contents.includes("I love to go on walks"));
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

  await api.post("/api/blogs").send(blogWithoutTitle).expect(400);

  await api.post("/api/blogs").send(blogWithoutUrl).expect(400);

  // test that new blog did not get added to database
  const response = await helper.blogsInDb();

  assert.strictEqual(response.length, helper.initialBlogs.length);
});

describe.only("deletion of a blog", () => {
  test.only("succeeds with status code 204 if id is valid for deletion", async () => {
    const blogs = await helper.blogsInDb();
    const blogToDelete = blogs[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

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
