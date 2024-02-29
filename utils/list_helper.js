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

module.exports = {
  dummy,
  totalLikes,
};
