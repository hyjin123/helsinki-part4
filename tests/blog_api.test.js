const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { Blog } = require("../models/blog");

const api = supertest(app);

const initialBlogs = [
  {
    title: "Life is up and down",
    author: "Sean Jin",
    url: "www.google.ca",
    likes: 2,
  },
  {
    title: "Coding is fun",
    author: "Nancy Tran",
    url: "www.youtube.com",
    likes: 3,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

test.only("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test.only("there are two blogs in the database", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test.only("unique identifier is named id", async () => {
  const response = await api.get("/api/blogs");

  // filter out all blogs with id property and it should match the number of initialBlog length
  const result = response.body.filter((blog) => blog.id);

  assert.strictEqual(result.length, initialBlogs.length);
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

  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length + 1);

  const contents = response.body.map((r) => r.title);

  assert(contents.includes("I love to go on walks"));
});

after(async () => {
  await mongoose.connection.close();
});
