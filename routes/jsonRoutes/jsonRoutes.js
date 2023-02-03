// Express
const express = require("express");
const jsonApiRouter = express.Router(); // Express Router

// Multipart middleware: allows you to access uploaded file from req.file
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const fs = require("fs");
const path = require("path");

// Import the mongoose models
const { User, Pet } = require("../../models/user");
const { Post } = require("../../models/post");
const { Service } = require("../../models/service");
const { Trade } = require("../../models/trade");

// To validate object IDs
const { isObjectIdOrHexString } = require("mongoose");

// Import helpers
const { handleError, mongoChecker } = require("../helpers/routeHelpers");

// Cloudinary: configure using credentials found on the Cloudinary Dashboard
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dypmf5kee",
  api_key: "846954122682332",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** Global object for constants */
const globals = {};
globals.CLOUDINARY_IMAGE_FOLDER = "pawfriends/";
globals.VALID_IMAGE_FILE_TYPES = ["png", "jpg", "jpeg", "gif"];
globals.DEFAULT_AVATAR = {
  imageId: "pawfriends/defaultAvatar_sflv0g",
  imageUrl:
    "https://res.cloudinary.com/dypmf5kee/image/upload/v1607124490/pawfriends/defaultAvatar_sflv0g.png",
};
// Only these fields are needed for display post- or comment-related information
// on the frontend
globals.POST_OWNER_PROJECTION = {
  _id: 1, // 1 to indicate only including these fields
  username: 1,
  actualName: 1,
  profilePicture: 1,
};

/**************** Middleware ****************/

/* Middleware for authentication of resources. */
const authenticate = (req, res, next) => {
  if (req.session.userId) {
    User.findById(req.session.userId)
      .then((user) => {
        if (!user) {
          return Promise.reject();
        } else {
          req.curUser = user;
          // req.curUserObj = user.toObject({ versionKey: false });
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
jsonApiRouter.use(mongoChecker);
jsonApiRouter.use(authenticate);

/**************** HELPERS FOR API ROUTES ****************/

/* Return true if obj is not a nonempty string. */
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
    // not avatar defined, use default
    response.owner.avatar = globals.DEFAULT_AVATAR;
  }
};

/* Modifies the response object into a format with all the information needed by
 * the frontend. */
const modifyPostResponse = async (response, postOwner, curUser) => {
  addOwnerToResponse(response, postOwner);

  response.numLikes = response.likedUsers.length;
  // Check whether the current user liked this post
  response.userLiked = response.likedUsers.some(
    (userObjectId) => curUser._id.toString() === userObjectId.toString()
  );

  // Populate comments array
  for (const comment of response.comments) {
    const commentOwner = await User.findById(comment.owner).select(
      globals.POST_OWNER_PROJECTION
    );
    addOwnerToResponse(comment, commentOwner);
  }

  // Delete fields that are now unnecessary for the client
  delete response["likedUsers"];
};

/** Image helper functions */
/* Attempt to upload the specified image to the Cloudinary server. */
const uploadImage = (imagePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imagePath,
      { folder: globals.CLOUDINARY_IMAGE_FOLDER },
      function (error, result) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve({
            imageId: result.public_id,
            imageUrl: result.url, // TODO: can change url to secure_url for https version
          });
        }
      }
    );
  });
};

/* Attempt to delete the specified image from the Cloudinary server. */
const deleteImage = (imageInfo) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      imageInfo.imageId,
      { invalidate: true }, // invalidate CDN cached copies of the image
      function (error, result) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

/* Process the req.files object for a given entry (entry can can a post, trade,
 * or service database entry, as long as it has an array field called "images")
 */
const processFilesForEntry = async (filesObj, entry) => {
  // Currently only support one uploaded image in filesObj
  if (
    filesObj.image !== undefined &&
    globals.VALID_IMAGE_FILE_TYPES.includes(
      path.extname(filesObj.image.name).toLowerCase().slice(1)
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

/**************** API ROUTES for updating various objects in database (Posts, Services, Trades) ****************/
/* Note: these are defined on the jsonApiRouter express router, which is loaded
 * on the "/api" url prefix already */

/**************** POSTS ROUTES ****************/

/* Create a new post. */
jsonApiRouter.post("/posts", multipartMiddleware, async (req, res) => {
  try {
    // Validate user input (title and content must be nonempty strings)
    if (notValidString(req.body.title) || notValidString(req.body.content)) {
      res.status(400).send("Bad Request");
      return;
    }

    // Create a new post
    const post = new Post({
      owner: req.curUser._id,
      postTime: new Date(), // use current server time
      title: req.body.title,
      content: req.body.content,
      likedUsers: [],
      images: [],
      comments: [],
    });
    if (req.files) {
      // req.files contains uploaded files
      await processFilesForEntry(req.files, post);
    }
    const newPost = await post.save();
    // Build the JSON object to respond with
    const jsonResponse = newPost.toObject({ versionKey: false });
    await modifyPostResponse(jsonResponse, req.curUser, req.curUser);
    res.send(jsonResponse);
  } catch (error) {
    // Return 500 Internal server error if error was from uploadImage?
    handleError(error, res);
  }
});

/* Add a comment onto a post. */
jsonApiRouter.post("/posts/:postId/comment", async (req, res) => {
  const postId = req.params.postId;
  try {
    // Check that postId is valid
    if (!isObjectIdOrHexString(postId)) {
      res.status(404).send("Not Found");
      return;
    }
    const post = await Post.findById(postId);
    if (post === null) {
      res.status(404).send("Not Found");
      return;
    }
    // Validate user input (content must be an nonempty string)
    if (notValidString(req.body.content)) {
      res.status(400).send("Bad Request");
      return;
    }

    // Create the new comment in the post
    const newLength = post.comments.push({
      owner: req.curUser._id,
      content: req.body.content,
    });
    await post.save();
    // Build the JSON object to respond with
    const jsonResponse = {
      content: post.comments[newLength - 1].content,
    };
    addOwnerToResponse(jsonResponse, req.curUser);
    res.send(jsonResponse);
  } catch (error) {
    handleError(error, res);
  }
});

/* Like or unlike a post. */
jsonApiRouter.put("/posts/:postId/like", async (req, res) => {
  const postId = req.params.postId;
  try {
    // Check that postId is valid
    if (!isObjectIdOrHexString(postId)) {
      res.status(404).send("Not Found");
      return;
    }
    const post = await Post.findById(postId);
    if (post === null) {
      res.status(404).send("Not Found");
      return;
    }
    // Validate user input (content must be an nonempty string)
    if (typeof req.body.like !== "boolean") {
      res.status(400).send("Bad Request");
      return;
    }

    const userIndex = post.likedUsers.findIndex(
      (userId) => userId.toString() === req.curUser._id.toString()
    );
    // Only 2 of the 4 cases require editing the database
    if (userIndex === -1 && req.body.like) {
      // user previously did not like the post but now likes it
      post.likedUsers.push(req.curUser._id);
      await post.save();
    } else if (userIndex !== -1 && !req.body.like) {
      // user previously liked the post but now wants to remove the like
      post.likedUsers.splice(userIndex, 1);
      await post.save();
    }
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

/* Get all posts.
 * TODO: limit to the current user + the current user's friends? */
jsonApiRouter.get("/posts", async (req, res) => {
  try {
    const _startTime = Date.now(); // TODO: debug remove
    const userPostObjs = await Post.find()
      .sort({ postTime: "descending" })
      .select("-__v") // remove fields unnecessary for the client
      .lean(); // Don't need to modify the document so just need the JS object
    // Modify array to send to the client
    for (const postObj of userPostObjs) {
      const postOwnerObj = await User.findById(postObj.owner)
        .select(globals.POST_OWNER_PROJECTION)
        .lean();
      await modifyPostResponse(postObj, postOwnerObj, req.curUser);
    }
    console.log("Runtime of GET posts/: ", Date.now() - _startTime); // TODO: debug remove
    res.send(userPostObjs);
  } catch (error) {
    handleError(error, res);
  }
});

/* Get a specific post. */
jsonApiRouter.get("/posts/:postId", async (req, res) => {
  const postId = req.params.postId;
  try {
    if (!isObjectIdOrHexString(postId)) {
      res.status(404).send("Not Found");
      return;
    }
    const postObj = await Post.findById(postId)
      .select("-__v") // remove fields unnecessary for the client
      .lean(); // Don't need to modify the document so just need the JS object
    if (postObj === null) {
      res.status(404).send("Not Found");
      return;
    }

    // Modify post response to send to the client
    const postOwnerObj = await User.findById(postObj.owner)
      .select(globals.POST_OWNER_PROJECTION)
      .lean();
    await modifyPostResponse(postObj, postOwnerObj, req.curUser);
    res.send(postObj);
  } catch (error) {
    handleError(error, res);
  }
});

/* Delete a post. */
jsonApiRouter.delete("/posts/:postId", async (req, res) => {
  const postId = req.params.postId;
  try {
    if (!isObjectIdOrHexString(postId)) {
      res.status(404).send("Not Found");
      return;
    }
    const post = await Post.findById(postId);
    if (post === null) {
      res.status(404).send("Not Found");
      return;
    }

    // Only the post owner can delete the post
    if (post.owner.toString() !== req.curUser._id.toString()) {
      res.status(403).send("Forbidden");
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

/* Get all service postings. */
jsonApiRouter.get("/services", async (req, res) => {
  try {
    const allServices = await Service.find()
      .sort({ postTime: "descending" })
      .select("-__v") // remove fields unnecessary for the client
      .lean(); // Don't need to modify the document so just need the JS object
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

/* Create a new service posting. */
jsonApiRouter.post("/services", multipartMiddleware, async (req, res) => {
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

    // Create a new service entry
    const service = new Service({
      owner: req.curUser._id,
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
    const jsonResponse = newService.toObject({ versionKey: false });
    // await modifyServiceResponse(jsonResponse, req.curUser, req.curUser);
    addOwnerToResponse(jsonResponse, req.curUser);
    res.send(jsonResponse);
  } catch (error) {
    // Return 500 Internal server error if error was from uploadImage?
    handleError(error, res);
  }
});

/* Modifies the response object into a format with all the information needed by
 * the frontend. */
const modifyTradeResponse = async (response, postOwner, curUser) => {
  addOwnerToResponse(response, postOwner);
};

/**************** TRADE ROUTES ****************/

/* Get all trade postings. */
jsonApiRouter.get("/trades", async (req, res) => {
  try {
    const allTrades = await Trade.find()
      .sort({ postTime: "descending" })
      .select("-__v") // remove fields unnecessary for the client
      .lean(); // Don't need to modify the document so just need the JS object
    // Modify array to send to the client
    for (const trade of allTrades) {
      const postOwner = await User.findById(trade.owner);
      await modifyTradeResponse(trade, postOwner, req.curUser);
    }
    res.send(allTrades);
  } catch (error) {
    handleError(error, res);
  }
});

/* Get a specific trade posting. */
jsonApiRouter.get("/trades/:tradeId", async (req, res) => {
  const tradeId = req.params.tradeId;
  try {
    if (!isObjectIdOrHexString(tradeId)) {
      res.status(404).send("Not Found");
      return;
    }
    const trade = await Trade.findById(tradeId);
    if (trade === null) {
      res.status(404).send("Not Found");
      return;
    }

    // Modify trade response to send to the client
    const postOwner = await User.findById(trade.owner);
    const jsonResponse = trade.toObject({ versionKey: false });
    await modifyTradeResponse(jsonResponse, postOwner, req.curUser);
    res.send(jsonResponse);
  } catch (error) {
    handleError(error, res);
  }
});

/* Create a new trade. */
jsonApiRouter.post("/trades", multipartMiddleware, async (req, res) => {
  try {
    // Validate user input (title and content must be nonempty strings)
    if (notValidString(req.body.title)) {
      res.status(400).send("Bad Request");
      return;
    }

    // Create a new trade
    const trade = new Trade({
      owner: req.curUser._id,
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
    const jsonResponse = newTrade.toObject({ versionKey: false });
    await modifyTradeResponse(jsonResponse, req.curUser, req.curUser);
    res.send(jsonResponse);
  } catch (error) {
    // Return 500 Internal server error if error was from uploadImage?
    handleError(error, res);
  }
});

/* Mark a trade as complete. */
jsonApiRouter.put("/trades/:tradeId/done", async (req, res) => {
  const tradeId = req.params.tradeId;
  try {
    // Check that id is valid
    if (!isObjectIdOrHexString(tradeId)) {
      res.status(404).send("Not Found");
      return;
    }
    const trade = await Trade.findById(tradeId);
    if (trade === null) {
      res.status(404).send("Not Found");
      return;
    }

    // TODO: check that curUser is the owner of the trade

    trade.done = true;
    await trade.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
  }
});

/* Delete a trade. */
jsonApiRouter.delete("/trades/:tradeId", async (req, res) => {
  const tradeId = req.params.tradeId;
  try {
    if (!isObjectIdOrHexString(tradeId)) {
      res.status(404).send("Not Found");
      return;
    }
    const trade = await Trade.findByIdAndDelete(tradeId);
    if (trade === null) {
      res.status(404).send("Not Found");
      return;
    }

    // TODO: check that curUser is the owner of the trade

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
// With users, use username as an identifier in routes, instead of user ObjectId

/* Return the information of the user specified by username. */
jsonApiRouter.get("/users/:username", async (req, res) => {
  const username = req.params.username;
  try {
    // Search for user
    const userObj = await User.findOne({ username: username })
      .select("-__v")
      .lean();
    if (userObj === null) {
      res.status(404).send("User does not exist");
      return;
    }

    // Default values for optional fields
    if (userObj.profilePicture === undefined) {
      userObj.profilePicture = globals.DEFAULT_AVATAR;
    }
    if (userObj.status === undefined) {
      userObj.status = "";
    }
    if (userObj.location === undefined) {
      userObj.location = "Somewhere, Earth";
    }

    res.send(userObj);
  } catch (error) {
    handleError(error, res);
  }
});

/* Save user status change. */
jsonApiRouter.put("/users/:username/status", async (req, res) => {
  if (req.session.username !== req.params.username) {
    // Users can only edit their own account
    res.status(403).send("Forbidden");
    return;
  }
  try {
    if (typeof req.body.status !== "string") {
      res.status(400).send("Bad Request");
      return;
    }
    // Save status
    req.curUser.status = req.body.status;
    await req.curUser.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
  }
});

/* Save user settings change. */
jsonApiRouter.put("/users/:username/settings", async (req, res) => {
  if (req.session.username !== req.params.username) {
    // Users can only edit their own account
    res.status(403).send("Forbidden");
    return;
  }
  try {
    // Save settings
    req.curUser.actualName = req.body.actualName;
    req.curUser.gender = req.body.gender;
    req.curUser.birthday = req.body.birthday;
    req.curUser.location = req.body.location;
    req.curUser.email = req.body.email;
    await req.curUser.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
  }
});

/* Add a new pet to user's profile. */
jsonApiRouter.post("/users/:userId/pets", async (req, res) => {
  if (req.session.userId !== req.params.userId) {
    // Users can only edit their own account
    res.status(403).send("Forbidden");
    return;
  }
  try {
    // Validate input
    if (
      notValidString(req.body.name) ||
      typeof req.body.likes !== "string" ||
      typeof req.body.dislikes !== "string"
    ) {
      res.status(400).send("Bad Request");
      return;
    }
    // Create Pet subdocument
    const newPet = new Pet({
      name: req.body.name,
      likes: req.body.likes,
      dislikes: req.body.dislikes,
      description: "Write anything about your pet here",
      // TODO: should description be set by the incoming request? If so validate the field in earlier if statement
    });
    req.curUser.pets.push(newPet);
    await req.curUser.save();

    res.send(newPet.toObject({ versionKey: false }));
  } catch (error) {
    handleError(error, res);
  }
});

/* Save pet information. */
jsonApiRouter.put("/users/:userId/:petId", async (req, res) => {
  if (req.session.userId !== req.params.userId) {
    // Users can only edit their own account
    res.status(403).send("Forbidden");
    return;
  }
  try {
    const pet = req.curUser.pets.id(req.params.petId);
    if (pet === null) {
      res.status(404).send("Not Found");
      return;
    }
    // Save information
    pet.name = req.body.name;
    pet.likes = req.body.likes;
    pet.dislikes = req.body.dislikes;
    pet.description = req.body.description;
    await req.curUser.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
  }
});

/* Delete a pet. */
jsonApiRouter.delete("/users/:userId/:petId", async (req, res) => {
  if (req.session.userId !== req.params.userId) {
    // Users can only edit their own account
    res.status(403).send("Forbidden");
    return;
  }
  try {
    const pet = req.curUser.pets.id(req.params.petId);
    if (pet === null) {
      res.status(404).send("Not Found");
      return;
    }
    // Delete pet at index
    const i = req.curUser.pets.indexOf(pet);
    req.curUser.pets.splice(i, 1);
    await req.curUser.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
  }
});

/* Add a friend. */
jsonApiRouter.put("/users/:userId/friends/:friendId", async (req, res) => {
  if (req.session.userId !== req.params.userId) {
    // Users can only edit their own account
    res.status(403).send("Forbidden");
    return;
  }
  try {
    // Don't add if already friends
    if (req.curUser.friends.includes(req.params.friendId)) {
      res.send({}); // Don't send error code for no-op
      return;
    }
    req.curUser.friends.push(req.params.friendId);
    await req.curUser.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
  }
});

/* Remove a friend. */
jsonApiRouter.delete("/users/:userId/friends/:friendId", async (req, res) => {
  if (req.session.userId !== req.params.userId) {
    // Users can only edit their own account
    res.status(403).send("Forbidden");
    return;
  }
  try {
    // Only remove friend that exists
    if (!req.curUser.friends.includes(req.params.friendId)) {
      res.status(404).send("Not Found");
      return;
    }
    const index = req.curUser.friends.indexOf(req.params.friendId);
    req.curUser.friends.splice(index, 1);
    await req.curUser.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
  }
});

// Export the router
module.exports = jsonApiRouter;
