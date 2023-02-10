const baseUrl =
  process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:5000";

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
      console.log("failed fetching @" + request.body);
      console.log(error);
    });
};

// <--- POST API --->
export const getAllUsersPosts = () => {
  const postsListPromise = fetchRequest(baseUrl + "/api/posts");
  // This promise resolves to an array of posts
  return postsListPromise;
};

export const createPost = (formData) => {
  const request = new Request(baseUrl + "/api/posts", {
    method: "post",
    body: formData,
  });

  const postPromise = fetchRequest(request);
  // This promise resolves to an object containing post info
  return postPromise;
};

export const removePost = (postId) => {
  const request = new Request(baseUrl + `/api/posts/${postId}`, {
    method: "delete",
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

export const modifyLikePost = (likePost, postId) => {
  const request = new Request(baseUrl + `/api/posts/${postId}/like`, {
    method: "put",
    body: JSON.stringify({ like: likePost }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  const commentPromise = fetchRequest(request);
  // This promise resolves to an object containing a subset of post info,
  // ie whether the user likes the post and the total number of likes
  return commentPromise;
};

// <--- TRADE API --->
export const getAllTrades = () => {
  const tradesListPromise = fetchRequest(baseUrl + "/api/trades");
  // This promise resolves to an array of trades
  return tradesListPromise;
};

export const createTrade = (trade) => {
  const request = new Request(baseUrl + "/api/trades", {
    method: "post",
    body: JSON.stringify(trade),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  const tradePromise = fetchRequest(request);
  // This promise resolves to an object containing trade info
  return tradePromise;
};

export const finishTrade = (tradeId) => {
  const request = new Request(baseUrl + `/api/trades/${tradeId}/done`, {
    method: "put",
  });

  const tradePromise = fetchRequest(request);
  // This promise resolves to an object containing trade info
  return tradePromise;
};

export const removeTrade = (tradeId) => {
  const request = new Request(baseUrl + `/api/trades/${tradeId}`, {
    method: "delete",
  });

  const tradePromise = fetchRequest(request);
  // This promise resolves to an object containing trade info
  return tradePromise;
};

// <--- SERVICE API --->
export const getAllServices = () => {
  const servicesListPromise = fetchRequest(baseUrl + "/api/services");
  // This promise resolves to an array of services
  return servicesListPromise;
};

export const createService = (service) => {
  const request = new Request(baseUrl + "/api/services", {
    method: "post",
    body: JSON.stringify(service),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  const servicePromise = fetchRequest(request);
  // This promise resolves to an object containing service info
  return servicePromise;
};

export const finishService = (serviceId) => {
  const request = new Request(baseUrl + `/api/services/${serviceId}/done`, {
    method: "put",
  });

  const servicePromise = fetchRequest(request);
  // This promise resolves to an object containing service info
  return servicePromise;
};

export const removeService = (serviceId) => {
  const request = new Request(baseUrl + `/api/services/${serviceId}`, {
    method: "delete",
  });

  const servicePromise = fetchRequest(request);
  // This promise resolves to an object containing service info
  return servicePromise;
};

// <--- USER PROFILE API --->
export const getUserByUsername = (username) => {
  const request = new Request(baseUrl + `/api/users/${username}`, {
    method: "get",
  });

  const promise = fetchRequest(request);
  return promise;
};

export const editStatus = (status, username) => {
  const request = new Request(baseUrl + `/api/users/${username}/status`, {
    method: "put",
    body: JSON.stringify(status),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  const promise = fetchRequest(request);
  return promise;
};

export const updateSettings = (settings, username) => {
  const request = new Request(baseUrl + `/api/users/${username}/settings`, {
    method: "put",
    body: JSON.stringify(settings),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  const promise = fetchRequest(request);
  return promise;
};

export const addPet = (pet, username) => {
  const request = new Request(baseUrl + `/api/users/${username}/pets`, {
    method: "post",
    body: JSON.stringify(pet),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  const promise = fetchRequest(request);
  return promise;
};

export const editPet = (pet, username, petId) => {
  const request = new Request(baseUrl + `/api/users/${username}/${petId}`, {
    method: "put",
    body: JSON.stringify(pet),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  const promise = fetchRequest(request);
  return promise;
};

export const removePet = (username, petId) => {
  const request = new Request(baseUrl + `/api/users/${username}/${petId}`, {
    method: "delete",
  });

  const promise = fetchRequest(request);
  return promise;
};

export const addFriend = (curUsername, friendUsername) => {
  const request = new Request(
    baseUrl + `/api/users/${curUsername}/friends/${friendUsername}`,
    {
      method: "put",
    }
  );

  const promise = fetchRequest(request);
  return promise;
};

export const removeFriend = (curUsername, friendUsername) => {
  const request = new Request(
    baseUrl + `/api/users/${curUsername}/friends/${friendUsername}`,
    {
      method: "delete",
    }
  );

  const promise = fetchRequest(request);
  return promise;
};

// <--- USER API --->
export const createUser = (userInfo) => {
  const request = new Request(baseUrl + `/users`, {
    method: "post",
    body: JSON.stringify(userInfo),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  const createUserPromise = fetchRequest(request);
  return createUserPromise;
};

/* userInfo should contain the string fields 'username' and 'password' */
export const loginUser = (userInfo) => {
  const request = new Request(baseUrl + `/users/login`, {
    method: "post",
    body: JSON.stringify(userInfo),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  const loginUserPromise = fetchRequest(request);
  return loginUserPromise;
};

export const logoutUser = () => {
  const request = new Request(baseUrl + `/users/logout`, {
    method: "get",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });

  const logoutUserPromise = fetchRequest(request);
  return logoutUserPromise;
};
