const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const initialValue = 0;
  const totalLikes = blogs.reduce((accumulator, item) => {
    return (accumulator += item.likes);
  }, 0);

  return totalLikes;
};

const favoriteBlog = (blogs) => {
  const blogLikes = blogs.map((blog) => blog.likes);

  const mostLiked = Math.max(...blogLikes);

  const blog = blogs.find((blog) => blog.likes === mostLiked);

  return blog;
};

const mostBlogs = (blogs) => {
  // extract all the authors into an array
  const authors = blogs.map((blog) => blog.author);

  // iterate through the authors array and count each of them
  const counter = {};
  authors.forEach((author) => {
    if (counter[author]) {
      counter[author] += 1;
    } else {
      counter[author] = 1;
    }
  });

  // console.log("this is the counter", counter);

  let mostBlogCounter = 0;
  const mostBlog = {};
  // loop through the object and find the author with most blogs
  for (const author in counter) {
    if (counter[author] > mostBlogCounter) {
      // set the new counter for the most blog
      mostBlogCounter = counter[author];
      mostBlog["author"] = author;
      mostBlog["blogs"] = counter[author];
    }
  }

  // console.log("this is the answer", mostBlog);

  return mostBlog;
};

const mostLikes = (blogs) => {
  // set an initial object
  const counter = [];
  blogs.forEach((blog) => {
    if (counter.filter((item) => item.author === blog.author).length > 0) {
      counter.forEach((item) => {
        // if author exists, find it and add to the number of likes
        if (item.author === blog.author) {
          item.likes += blog.likes;
        }
      });
    } else {
      // if author doesnt exist, add to the counter list
      counter.push({ author: blog.author, likes: blog.likes });
    }
  });

  console.log("this is the counter", counter);

  let mostLikedCounter = 0;
  let mostLiked = {};
  // loop through the object and find the author with most likes
  counter.forEach((item) => {
    if (item.likes > mostLikedCounter) {
      mostLikedCounter = item.likes;
      mostLiked = item;
    }
  });

  return mostLiked;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
