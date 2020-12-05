const baseUrl = process.env.SERVER_BASE_URL || "http://localhost:5000";

const fetchRequest = (request) => {
  return fetch(request)
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
};

export const getAllUsersPosts = () => {
  const postsListPromise = fetchRequest(baseUrl + "/api/posts");
  // This promise resolves to an array of posts
  return postsListPromise;
};

export const createPost = (post) => {
  const request = new Request(baseUrl + "/api/posts", {
    method: "post",
    body: JSON.stringify(post),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  const postPromise = fetchRequest(request);
  // This promise resolves to an object containing post info
  return postPromise;
};

export const createComment = (comment, postId) => {
  const request = new Request(baseUrl + `/api/posts/${postId}/comment`, {
    method: "post",
    body: JSON.stringify(comment),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  const commentPromise = fetchRequest(request);
  // This promise resolves to an object containing comment info
  return commentPromise;
};
