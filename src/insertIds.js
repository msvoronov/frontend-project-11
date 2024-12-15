const insertIds = (posts, maxId) => {
  const preparedPosts = posts.map((post) => {
    const id = {
      id: maxId + posts.indexOf(post),
    };
    return { ...post, ...id };
  });
  return preparedPosts;
};

export default insertIds;
