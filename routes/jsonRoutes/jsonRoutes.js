// express
const express = require("express");
const jsonApiRouter = express.Router(); // Express Router

// multipart middleware: allows you to access uploaded file from req.file
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const fs = require("fs");

// import the mongoose models
const { User, Pet } = require("../../models/user");
const { Post } = require("../../models/post");
const { Service } = require("../../models/service");
const { Trade } = require("../../models/trade");

// to validate object IDs
const { ObjectID } = require("mongodb");

// import helpers
const { isMongoError, mongoChecker } = require("../helpers/routeHelpers");

// cloudinary: configure using credentials found on the Cloudinary Dashboard
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dypmf5kee",
  api_key: "666517587772385",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "***REMOVED***",
});
// Global object
const globals = {};
globals.validImageFileTypes = ["png", "jpg", "jpeg", "gif"];
globals.defaultAvatar = {
  image_id: "pawfriends/defaultAvatar_sflv0g",
  image_url:
    "https://res.cloudinary.com/dypmf5kee/image/upload/v1607124490/pawfriends/defaultAvatar_sflv0g.png",
};

/**************** Middleware ****************/

// Middleware for authentication of resources
const authenticate = (req, res, next) => {
  if (req.session.user) {
    User.findById(req.session.user)
      .then((user) => {
        if (!user) {
          return Promise.reject();
        } else {
          req.user = user;
          next();
        }
      })
      .catch((error) => {
        res.status(401).send("Unauthorized");
      });
  } else {
    res.status(401).send("Unauthorized");
  }
};

/**************** HELPERS FOR API ROUTES ****************/
// Send the appropriate error in the response if something fails in a route body
const handleError = (error, res) => {
  if (isMongoError(error)) {
    res.status(500).send("Internal server error");
  } else {
    console.log(error);
    res.status(400).send("Bad Request");
  }
};
jsonApiRouter.use(mongoChecker);
jsonApiRouter.use(authenticate);

// Return true is obj is not a nonempty string
const notValidString = (obj) => {
  return typeof obj !== "string" || obj === "";
};

/* Overwrites the 'owner' key of the response object into a format with all the
 * information needed by the frontend. */
const addOwnerToResponse = (response, owner) => {
  response.owner = {
    _id: owner._id,
    username: owner.username,
    actualName: owner.actualName,
    avatar: owner.profilePicture,
  };
  if (response.owner.avatar === undefined) {
    response.owner.avatar = globals.defaultAvatar; // set to be the default avatar
  }
};

/* Modifies the response object into a format with all the information needed by
 * the frontend. */
const modifyPostReponse = async (response, postOwner, curUser) => {
  addOwnerToResponse(response, postOwner);

  response.numLikes = response.likedUsers.length;
  // Check whether the current user liked this post
  response.userLiked = false;
  if (
    response.likedUsers.some(
      (userId) => curUser._id.toString() === userId.toString()
    )
  ) {
    response.userLiked = true;
  }

  // Populate comments array
  for (const comment of response.comments) {
    const commentOwner = await User.findById(comment.owner);
    addOwnerToResponse(comment, commentOwner);
  }

  // Delete fields that are now unnecessary for the client
  delete response["likedUsers"];
};

// Image helper functions
const uploadImage = (imagePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imagePath, // req.files contains uploaded files
      { folder: "pawfriends/" },
      function (error, result) {
        console.log(error, result);
        if (error) {
          reject(error);
        } else {
          resolve({
            image_id: result.public_id,
            image_url: result.url,
          });
        }
      }
    );
  });
};

const deleteImage = (imageInfo) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      imageInfo.image_id,
      { invalidate: true },
      function (error, result) {
        console.log(error, result);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

// Process the req.files object for a given entry (entry can can a post, trade, or service database entry, as long as it has an array field called "images")
const processFilesForEntry = async (filesObj, entry) => {
  if (
    filesObj.image !== undefined &&
    globals.validImageFileTypes.includes(
      filesObj.image.name.split(".").pop().toLowerCase()
    )
  ) {
    // There's a valid uploaded image, upload it to the Cloudinary server
    const imageInfo = await uploadImage(filesObj.image.path);
    entry.images.push(imageInfo);
  }
  // Delete temporary files in filesObj to not take up space on server
  for (const key in filesObj) {
    fs.unlink(filesObj[key].path, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
};

/**************** API ROUTES for updating various objs in database (Posts, Services, Trades) ****************/
/* Note: these are defined on the jsonApiRouter express router, which is loaded
 * on the "/api" url prefix already */

/**************** POSTS ROUTES ****************/

/* Create a new post */
jsonApiRouter.post("/posts", multipartMiddleware, async (req, res) => {
  const username = req.session.username;
  // const username = "user"; // TODO: remove after authentication is implemented
  try {
    // Validate user input (title and content must be nonempty strings)
    if (notValidString(req.body.title) || notValidString(req.body.content)) {
      res.status(400).send("Bad Request");
      return;
    }

    // Authentication passed, meaning user is valid
    const user = await User.findOne({ username: username });

    // Create a new post
    const post = new Post({
      owner: user._id,
      postTime: new Date(), // use current server time
      title: req.body.title,
      content: req.body.content,
      likedUsers: [],
      images: [],
      comments: [],
    });
    if (req.files) {
      await processFilesForEntry(req.files, post);
    }
    const newPost = await post.save();
    // Build the JSON object to respond with
    const jsonReponse = newPost.toObject();
    delete jsonReponse["__v"];
    await modifyPostReponse(jsonReponse, user, user);
    res.send(jsonReponse);
  } catch (error) {
    // Return 500 Internal server error if error was from uploadImage?
    handleError(error, res);
  }
});

/* Add a comment onto a post */
jsonApiRouter.post("/posts/:postId/comment", async (req, res) => {
  const username = req.session.username;
  // const username = "user"; // TODO: remove after authentication is implemented
  const postId = req.params.postId;
  try {
    // Check that postId is valid
    if (!ObjectID.isValid(postId)) {
      res.status(404).send();
      return;
    }
    const post = await Post.findById(postId);
    if (post === null) {
      res.status(404).send();
      return;
    }
    // Validate user input (content must be an nonempty string)
    if (notValidString(req.body.content)) {
      res.status(400).send("Bad Request");
      return;
    }

    const user = await User.findOne({ username: username });

    // Create the new comment in the post
    const newLength = post.comments.push({
      owner: user._id,
      content: req.body.content,
    });
    await post.save();
    // Build the JSON object to respond with
    const jsonResponse = {
      content: post.comments[newLength - 1].content,
    };
    addOwnerToResponse(jsonResponse, user);
    res.send(jsonResponse);
  } catch (error) {
    handleError(error, res);
  }
});

// Like or unlike a post
jsonApiRouter.put("/posts/:postId/like", async (req, res) => {
  const username = req.session.username;
  // const username = "user"; // TODO: remove after authentication is implemented
  const postId = req.params.postId;
  try {
    // Check that postId is valid
    if (!ObjectID.isValid(postId)) {
      res.status(404).send();
      return;
    }
    const post = await Post.findById(postId);
    if (post === null) {
      res.status(404).send();
      return;
    }
    // Validate user input (content must be an nonempty string)
    if (typeof req.body.like !== "boolean") {
      res.status(400).send("Bad Request");
      return;
    }

    const user = await User.findOne({ username: username });

    const userIndex = post.likedUsers.findIndex(
      (userId) => userId.toString() === user._id.toString()
    );
    // Only 2 of the 4 cases require editing the database
    if (userIndex === -1 && req.body.like) {
      // user previously did not like the post but now likes it
      post.likedUsers.push(user._id);
    } else if (userIndex !== -1 && !req.body.like) {
      // user previously liked the post but now wants to remove the like
      post.likedUsers.splice(userIndex, 1);
    }
    await post.save();
    // Build the JSON object to respond with
    const jsonResponse = {
      numLikes: post.likedUsers.length,
      userLiked: req.body.like,
    };
    res.send(jsonResponse);
  } catch (error) {
    handleError(error, res);
  }
});

// Get all posts (limit to the current user + the current user's friends?)
jsonApiRouter.get("/posts", async (req, res) => {
  const username = req.session.username;
  // const username = "user"; // TODO: remove after authentication is implemented
  try {
    // Authentication passed, meaning user is valid
    const curUser = await User.findOne({ username: username });

    // could use .limit() before .lean() to limit the number of items to return
    const userPosts = await Post.find()
      .sort({
        postTime: "descending",
      })
      .select("-__v") // remove fields unnecessary for the client
      .lean();
    // Modify array to send to the client
    for (const post of userPosts) {
      const postOwner = await User.findById(post.owner);
      await modifyPostReponse(post, postOwner, curUser);
    }
    res.send(userPosts);
  } catch (error) {
    handleError(error, res);
  }
});

// Get a specific post
jsonApiRouter.get("/posts/:postId", async (req, res) => {
  const username = req.session.username;
  // const username = "user"; // TODO: remove after authentication is implemented
  const postId = req.params.postId;
  try {
    if (!ObjectID.isValid(postId)) {
      res.status(404).send();
      return;
    }
    const post = await Post.findById(postId);
    if (post === null) {
      res.status(404).send();
      return;
    }

    // Authentication passed, meaning user is valid
    const curUser = await User.findOne({ username: username });

    // Modify post response to send to the client
    const postOwner = await User.findById(post.owner);
    const jsonReponse = post.toObject();
    delete jsonReponse["__v"];
    await modifyPostReponse(jsonReponse, postOwner, curUser);
    res.send(jsonReponse);
  } catch (error) {
    handleError(error, res);
  }
});

// Delete a post
jsonApiRouter.delete("/posts/:postId", async (req, res) => {
  const username = req.session.username;
  // const username = "user"; // TODO: remove after authentication
  const postId = req.params.postId;
  try {
    if (!ObjectID.isValid(postId)) {
      res.status(404).send();
      return;
    }
    const post = await Post.findById(postId);
    if (post === null) {
      res.status(404).send();
      return;
    }

    // Authentication passed, meaning user is valid
    const user = await User.findOne({ username: username });

    // Only the post owner can delete the post
    if (post.owner.toString() !== user._id.toString()) {
      res.status(403).send();
      return;
    }

    // Delete images from cloudinary server
    for (const image of post.images) {
      await deleteImage(image);
    }
    post.remove();
    res.send({});
  } catch (error) {
    // Return 500 Internal server error if error was from deleteImage?
    handleError(error, res);
  }
});

/**************** SERVICE ROUTES ****************/

// get all service postings
jsonApiRouter.get("/services", async (req, res) => {
  const username = req.session.username;
  // const username = "user"; // TODO: remove after authentication is implemented
  try {
    // Authentication passed, meaning user is valid
    // const curUser = await User.findOne({ username: username });

    // could use .limit() before .lean() to limit the number of items to return
    const allServices = await Service.find()
      .sort({
        postTime: "descending",
      })
      .select("-__v") // remove fields unnecessary for the client
      .lean();
    // Modify array to send to the client
    for (const service of allServices) {
      const postOwner = await User.findById(service.owner);
      addOwnerToResponse(service, postOwner);
    }
    res.send(allServices);
  } catch (error) {
    handleError(error, res);
  }
});

/* Create a new service posting */
jsonApiRouter.post("/services", multipartMiddleware, async (req, res) => {
  // const username = req.session.username;
  const username = "user"; // TODO: remove after authentication is implemented
  try {
    // Validate user input (description, email, phone, and all elements of the tags array must be nonempty strings)
    if (
      notValidString(req.body.description) ||
      notValidString(req.body.email) ||
      notValidString(req.body.phone) ||
      !Array.isArray(req.body.tags) ||
      req.body.tags.some((tag) => notValidString(tag))
    ) {
      res.status(400).send("Bad Request");
      return;
    }

    // Authentication passed, meaning user is valid
    const user = await User.findOne({ username: username });

    // Create a new trade
    const service = new Service({
      owner: user._id,
      postTime: new Date(), // use current server time
      description: req.body.description,
      email: req.body.email,
      phone: req.body.phone,
      tags: req.body.tags,
      images: [],
    });
    if (req.files) {
      await processFilesForEntry(req.files, service);
    }
    const newService = await service.save();
    // Build the JSON object to respond with
    const jsonReponse = newService.toObject();
    delete jsonReponse["__v"];
    // await modifyServiceReponse(jsonReponse, user, user);
    addOwnerToResponse(jsonReponse, user);
    res.send(jsonReponse);
  } catch (error) {
    // Return 500 Internal server error if error was from uploadImage?
    handleError(error, res);
  }
});

/* Modifies the response object into a format with all the information needed by
 * the frontend. */
const modifyTradeReponse = async (response, postOwner, curUser) => {
  addOwnerToResponse(response, postOwner);
};

/**************** TRADE ROUTES ****************/

// Get all trade postings
jsonApiRouter.get("/trades", async (req, res) => {
  const username = req.session.username;
  // const username = "user"; // TODO: remove after authentication is implemented
  try {
    // Authentication passed, meaning user is valid
    const curUser = await User.findOne({ username: username });

    // could use .limit() before .lean() to limit the number of items to return
    const allTrades = await Trade.find()
      .sort({
        postTime: "descending",
      })
      .select("-__v") // remove fields unnecessary for the client
      .lean();
    // Modify array to send to the client
    for (const trade of allTrades) {
      const postOwner = await User.findById(trade.owner);
      await modifyTradeReponse(trade, postOwner, curUser);
    }
    res.send(allTrades);
  } catch (error) {
    handleError(error, res);
  }
});

// Get a specific trade posting
jsonApiRouter.get("/trades/:tradeId", async (req, res) => {
  const username = req.session.username;
  // const username = "user"; // TODO: remove after authentication is implemented
  const tradeId = req.params.tradeId;
  try {
    if (!ObjectID.isValid(tradeId)) {
      res.status(404).send();
      return;
    }
    const trade = await Trade.findById(tradeId);
    if (trade === null) {
      res.status(404).send();
      return;
    }

    // Authentication passed, meaning user is valid
    const curUser = await User.findOne({ username: username });

    // Modify trade response to send to the client
    const postOwner = await User.findById(trade.owner);
    const jsonReponse = trade.toObject();
    delete jsonReponse["__v"];
    await modifyTradeReponse(jsonReponse, postOwner, curUser);
    res.send(jsonReponse);
  } catch (error) {
    handleError(error, res);
  }
});

/* Create a new trade */
jsonApiRouter.post("/trades", multipartMiddleware, async (req, res) => {
  const username = req.session.username;
  // const username = "user"; // TODO: remove after authentication is implemented
  try {
    // Validate user input (title and content must be nonempty strings)
    if (notValidString(req.body.title)) {
      res.status(400).send("Bad Request");
      return;
    }

    // Authentication passed, meaning user is valid
    const user = await User.findOne({ username: username });

    // Create a new trade
    const trade = new Trade({
      owner: user._id,
      postTime: new Date(), // use current server time
      title: req.body.title,
      images: [],
      done: false,
    });
    if (req.files) {
      await processFilesForEntry(req.files, trade);
    }
    const newTrade = await trade.save();
    // Build the JSON object to respond with
    const jsonReponse = newTrade.toObject();
    delete jsonReponse["__v"];
    await modifyTradeReponse(jsonReponse, user, user);
    res.send(jsonReponse);
  } catch (error) {
    // Return 500 Internal server error if error was from uploadImage?
    handleError(error, res);
  }
});

// Mark a trade as complete
jsonApiRouter.put("/trades/:tradeId/done", async (req, res) => {
  const tradeId = req.params.tradeId;
  try {
    // Check that id is valid
    if (!ObjectID.isValid(tradeId)) {
      res.status(404).send();
      return;
    }
    const trade = await Trade.findById(tradeId);
    if (trade === null) {
      res.status(404).send();
      return;
    }
    trade.done = true;
    await trade.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
  }
});

// Delete a trade
jsonApiRouter.delete("/trades/:tradeId", async (req, res) => {
  const tradeId = req.params.tradeId;
  try {
    if (!ObjectID.isValid(tradeId)) {
      res.status(404).send();
      return;
    }
    const trade = await Trade.findByIdAndDelete(tradeId);
    if (trade === null) {
      res.status(404).send();
      return;
    }

    // Delete images from cloudinary server
    for (const image of trade.images) {
      await deleteImage(image);
    }
    res.send({});
  } catch (error) {
    // Return 500 Internal server error if error was from deleteImage?
    handleError(error, res);
  }
});

/**************** USER PROFILE ROUTES ****************/

/* Return User object that matches username */
jsonApiRouter.get("/users/username/:username", async (req, res) => {
  const username = req.params.username;
  try {
    // Search for user
    const user = await User.findOne({ username: username });
    if (user === null) {
      res.status(404).send();
      return;
    }

    if (user.profilePicture === undefined) {
      user.profilePicture = globals.defaultAvatar;
    }

    if (user.status === undefined) {
      user.status = "Empty status";
    }

    if (user.location === undefined) {
      user.location = "Somewhere, Earth";
    }

    res.send(user);
  } catch (error) {
    handleError(error, res);
  }
});

/* Return User object that matches userId */
jsonApiRouter.get("/users/userId/:userId", async (req, res) => {
  try {
    // Search for user
    const user = await User.findById(req.params.userId);
    if (user === null) {
      res.status(404).send();
      return;
    }

    if (user.profilePicture === undefined) {
      user.profilePicture = globals.defaultAvatar;
    }

    if (user.status === undefined) {
      user.status = "Empty status";
    }

    if (user.location === undefined) {
      user.location = "Somewhere, Earth";
    }

    res.send(user);
  } catch (error) {
    handleError(error, res);
  }
});

// Save user status change
jsonApiRouter.put("/users/:username/status", async (req, res) => {
  const username = req.params.username;
  if (req.session.username !== username) {
    // users can only edit their own profile
    res.status(403).send();
    return;
  }
  try {
    const user = await User.findOne({ username: username });
    // validate
    if (user === null) {
      res.status(404).send();
      return;
    }
    if (typeof req.body.status !== "string") {
      res.status(400).send("Bad Request");
      return;
    }
    // save status
    user.status = req.body.status;
    user.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
  }
});

// Save user status change
jsonApiRouter.put("/users/:username/settings", async (req, res) => {
  const username = req.params.username;
  if (req.session.username !== username) {
    // users can only edit their own profile
    res.status(403).send();
    return;
  }
  try {
    const user = await User.findOne({ username: username });
    // validate
    if (user === null) {
      res.status(404).send();
      return;
    }
    // save status
    user.actualName = req.body.actualName;
    user.gender = req.body.gender;
    user.birthday = req.body.birthday;
    user.location = req.body.location;
    user.email = req.body.email;
    user.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
  }
});

// Add a new pet to user's profile
jsonApiRouter.post("/users/:userId/pets", async (req, res) => {
  if (req.session.user !== req.params.userId) {
    // users can only edit their own profile
    res.status(403).send();
    return;
  }
  try {
    const user = await User.findById(req.params.userId);
    if (user === null) {
      res.status(404).send();
      return;
    }
    if (
      notValidString(req.body.name) ||
      typeof req.body.likes !== "string" ||
      typeof req.body.dislikes !== "string"
    ) {
      res.status(400).send("Bad Request");
      return;
    }
    const newPet = new Pet({
      name: req.body.name,
      likes: req.body.likes,
      dislikes: req.body.dislikes,
      description: "Write anything about your pet here",
    });
    user.pets.push(newPet);
    user.save();
    res.send(newPet);
  } catch (error) {
    handleError(error, res);
  }
});

// Save pet information
jsonApiRouter.put("/users/:userId/:petId", async (req, res) => {
  if (req.session.user !== req.params.userId) {
    // users can only edit their own profile
    res.status(403).send();
    return;
  }
  try {
    const user = await User.findById(req.params.userId);
    if (user === null) {
      res.status(404).send();
      return;
    }
    const pet = user.pets.id(req.params.petId);
    if (pet === null) {
      res.status(404).send();
      return;
    }
    // save information
    const i = user.pets.indexOf(pet);
    user.pets[i].name = req.body.name;
    user.pets[i].likes = req.body.likes;
    user.pets[i].dislikes = req.body.dislikes;
    user.pets[i].description = req.body.description;
    user.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
    console.log("hmm");
  }
});

// Delete a pet
jsonApiRouter.delete("/users/:userId/:petId", async (req, res) => {
  if (req.session.user !== req.params.userId) {
    // users can only edit their own profile
    res.status(403).send();
    return;
  }
  try {
    const user = await User.findById(req.params.userId);
    if (user === null) {
      res.status(404).send();
      return;
    }
    const pet = user.pets.id(req.params.petId);
    if (pet === null) {
      res.status(404).send();
      return;
    }
    // delete pet at index
    const i = user.pets.indexOf(pet);
    user.pets.splice(i, 1);
    user.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
    console.log("hmm");
  }
});

/* Add a friend */
jsonApiRouter.put("/users/:userId/friends/:friendId", async (req, res) => {
  if (req.session.user !== req.params.userId) {
    // users can only edit their own profile
    res.status(403).send();
    return;
  }
  try {
    const user = await User.findById(req.params.userId);
    if (user === null) {
      res.status(404).send();
      return;
    }
    // create friends array if no friends yet
    if (!user.friends) {
      user.friends = [];
    }
    // don't add if already friends
    if (user.friends.includes(req.params.friendId)) {
      res.status(403).send();
      return;
    }
    user.friends.push(req.params.friendId);
    user.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
    console.log("hmm");
  }
});

/* Remove a friend */
jsonApiRouter.delete("/users/:userId/friends/:friendId", async (req, res) => {
  if (req.session.user !== req.params.userId) {
    // users can only edit their own profile
    res.status(403).send();
    return;
  }
  try {
    const user = await User.findById(req.params.userId);
    if (user === null) {
      res.status(404).send();
      return;
    }
    // only remove friend that exists
    if (!user.friends || !user.friends.includes(req.params.friendId)) {
      res.status(403).send();
      return;
    }
    const index = user.friends.indexOf(req.params.friendId);
    user.friends.splice(index, 1);
    user.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
    console.log("hmm");
  }
});

// export the router
module.exports = jsonApiRouter;
