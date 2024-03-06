const blogsRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const { Blog } = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
  });

  response.json(blogs);

  // Blog.find({}).then((blogs) => {
  //   response.json(blogs);
  // });
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  if (blog) {
    response.status(200).json(blog);
  } else {
    // 404 means not found
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  let blog = null;
  const body = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  console.log("this is decoded token", decodedToken);

  if (!decodedToken.id) {
    return response.status(401).json({ error: "invalid token" });
  }

  const user = await User.findById(decodedToken.id);

  const formattedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id,
  };

  // if no title or url, respond with 400 status code; bad request
  if (body.title && body.url) {
    // if likes is not specified, set it to 0
    if (body.likes) {
      blog = new Blog(formattedBlog);
    } else {
      const rawBlog = formattedBlog;
      rawBlog.likes = 0;
      blog = new Blog(rawBlog);
    }
  } else {
    // 400 means invalid input
    response.status(400).end();
  }

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
  response.status(201).json(result);

  // blog.save().then((result) => {
  //   response.status(201).json(result);
  // });
});

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;

  await Blog.findByIdAndDelete(id);

  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const id = request.params.id;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true });

  response.status(200).json(updatedBlog);
});

module.exports = blogsRouter;
