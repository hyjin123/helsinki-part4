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

  if (blog) {
    response.status(200).json(blog);
  } else {
    // 404 means not found
    response.status(404).end();
  }
});

blogsRouter.post("/", async (request, response) => {
  let blog = null;

  // if no title or url, respond with 400 status code; bad request
  if (request.body.title && request.body.url) {
    // if likes is not specified, set it to 0
    if (request.body.likes) {
      blog = new Blog(request.body);
    } else {
      const rawBlog = request.body;
      rawBlog.likes = 0;
      blog = new Blog(rawBlog);
    }
  } else {
    // 400 means invalid input
    response.status(400).end();
  }

  const result = await blog.save();
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
