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

const mostLikes = (blogs) => {
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

  console.log("this is the counter", counter);

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

  console.log("this is the answer", mostBlog);

  return mostBlog;
};

module.exports = {
  dummy,
  totalLikes,
  mostLikes,
  mostBlogs,
};
