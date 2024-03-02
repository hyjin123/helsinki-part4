const blogsRouter = require("express").Router();
const { Blog } = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);

  // Blog.find({}).then((blogs) => {
  //   response.json(blogs);
  // });
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  response.status(201).json(blog);
});

blogsRouter.post("/", async (request, response) => {
  let blog = null;

  // if likes is not specified, set it to 0
  if (request.body.likes) {
    blog = new Blog(request.body);
  } else {
    const rawBlog = request.body;
    rawBlog.likes = 0;
    blog = new Blog(rawBlog);
  }

  const result = await blog.save();
  response.status(201).json(result);

  // blog.save().then((result) => {
  //   response.status(201).json(result);
  // });
});

module.exports = blogsRouter;
