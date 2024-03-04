const { Blog } = require("../models/blog");
const User = require("../models/user");

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

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  usersInDb,
};
