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

  console.log("this is answer", blog);

  return blog;
};

module.exports = {
  dummy,
  totalLikes,
  mostLikes,
};
