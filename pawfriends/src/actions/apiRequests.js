const baseUrl = process.env.SERVER_BASE_URL || "http://localhost:5000";

export const getAllUsersPosts = () => {
  const postsListPromise = fetch(baseUrl + "/api/posts")
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        throw new Error("The request failed, please try again later");
      }
    })
    .then((json) => {
      return json;
    })
    .catch((error) => {
      console.log(error);
    });
  // This promise resolves to an array of posts
  return postsListPromise;
};
