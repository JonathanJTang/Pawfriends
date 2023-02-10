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
const {
  notValidString,
  handleError,
  mongoChecker,
} = require("../helpers/routeHelpers");

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
  const hasImage = filesObj.image && filesObj.image.name !== "";
  let fileExt, isValidFileType;
  if (hasImage) {
    fileExt = path.extname(filesObj.image.name).toLowerCase();
    isValidFileType = globals.VALID_IMAGE_FILE_TYPES.includes(
      fileExt.slice(1)
    );
    if (isValidFileType) {
      // There's a valid uploaded image, upload it to the Cloudinary server
      const imageInfo = await uploadImage(filesObj.image.path);
      entry.images.push(imageInfo);
    }
  }
  // Delete temporary files in filesObj to not take up space on server
  for (const key in filesObj) {
    fs.unlink(filesObj[key].path, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
  if (hasImage && !isValidFileType) {
    throw new TypeError(`${fileExt} is not one of the valid image file \
                        extensions in ${globals.VALID_IMAGE_FILE_TYPES}`);
  }
};

/* Generic deletion method for an entry with a owner field that's an ObjectId.
   Entry currently can be a Post, Service, or Trade.
   If hasImagesArray is true, attempt to delete all images in the images array.
   
   A generic deletion method is possible because of similar Schema structures,
   and because not much field-specific processing is required.
 */
const deleteEntry = async (req, res, Model, entryId, hasImagesArray) => {
  try {
    if (!isObjectIdOrHexString(entryId)) {
      res.status(404).send("Not Found");
      return;
    }
    const entry = await Model.findById(entryId);
    if (entry === null) {
      res.status(404).send("Not Found");
      return;
    }

    // Only the entry owner can delete the entry
    if (entry.owner.toString() !== req.curUser._id.toString()) {
      res.status(403).send("Forbidden");
      return;
    }

    // Delete images from cloudinary server
    if (hasImagesArray) {
      // Delete images from cloudinary server
      const success = await Promise.allSettled(entry.images.map(deleteImage));
      success.forEach((result, i) => {
        if (result.status === "rejected") {
          console.log(
            `For ${entry}, deleting image ${i} failed because of: `,
            result.reason
          );
        }
      });
    }
    entry.remove();
    res.send({});
  } catch (error) {
    // Return 500 Internal server error if error was from deleteImage?
    handleError(error, res);
  }
};

/* Overwrites fields of the responseOwner object into a format with all the
 * information needed by the frontend.
 * responseOwner should usually be the owner field of a response. */
const addOwnerObjInfo = (responseOwner, owner) => {
  responseOwner._id = owner._id;
  responseOwner.username = owner.username;
  responseOwner.actualName = owner.actualName;
  responseOwner.profilePicture = owner.profilePicture;

  if (responseOwner.profilePicture === undefined) {
    // No avatar defined, use default
    responseOwner.profilePicture = globals.DEFAULT_AVATAR;
  }
};

/* Modifies the response object into a format with all the information needed by
 * the frontend. */
const modifyPostResponse = async (response, postOwner, curUser) => {
  response.owner = {};
  addOwnerObjInfo(response.owner, postOwner);

  response.numLikes = response.likedUsers.length;
  // Check whether the current user liked this post
  response.userLiked = response.likedUsers.some(
    (userObjectId) => curUser._id.toString() === userObjectId.toString()
  );
  // Only the post owner can mark completion / delete the post
  response.curUserIsOwner = postOwner._id.toString() === curUser._id.toString();

  // Populate comments array
  for (const comment of response.comments) {
    const commentOwnerObj = await User.findById(comment.owner)
      .select(globals.POST_OWNER_PROJECTION)
      .lean();
    comment.owner = {};
    addOwnerObjInfo(comment.owner, commentOwnerObj);
  }

  // Delete fields that are now unnecessary for the client
  delete response["likedUsers"];
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
    // Check error instanceof TypeError && error.message.includes("not one of the valid image file extensions")
    handleError(error, res);
  }
});

/* Add a comment onto a post. */
jsonApiRouter.post("/posts/:postId/comment", async (req, res) => {
  const postId = req.params.postId;
  try {
    // Validate user input (content must be an nonempty string)
    if (notValidString(req.body.content)) {
      res.status(400).send("Bad Request");
      return;
    }
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

    // Create the new comment in the post
    const newLength = post.comments.push({
      owner: req.curUser._id,
      content: req.body.content,
    });
    await post.save();
    // Build the JSON object to respond with
    const jsonResponse = {
      content: post.comments[newLength - 1].content,
      owner: {},
    };
    addOwnerObjInfo(jsonResponse.owner, req.curUser);
    res.send(jsonResponse);
  } catch (error) {
    handleError(error, res);
  }
});

/* Like or unlike a post. */
jsonApiRouter.put("/posts/:postId/like", async (req, res) => {
  const postId = req.params.postId;
  try {
    // Validate user input (content must be an nonempty string)
    if (typeof req.body.like !== "boolean") {
      res.status(400).send("Bad Request");
      return;
    }
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
  // deleteEntry handles all the validation and error handling
  deleteEntry(req, res, Post, req.params.postId, true);
});

/**************** SERVICE ROUTES ****************/

/* Get all service postings. */
jsonApiRouter.get("/services", async (req, res) => {
  try {
    const allServiceObjs = await Service.find()
      .sort({ postTime: "descending" })
      .select("-__v") // remove fields unnecessary for the client
      .lean(); // Don't need to modify the document so just need the JS object
    // Modify array to send to the client
    for (const serviceObj of allServiceObjs) {
      const postOwnerObj = await User.findById(serviceObj.owner)
        .select(globals.POST_OWNER_PROJECTION)
        .lean();
      serviceObj.owner = {};
      addOwnerObjInfo(serviceObj.owner, postOwnerObj);
    }
    res.send(allServiceObjs);
  } catch (error) {
    handleError(error, res);
  }
});

/* Get a specific trade posting. */
jsonApiRouter.get("/services/:serviceId", async (req, res) => {
  const serviceId = req.params.serviceId;
  try {
    if (!isObjectIdOrHexString(serviceId)) {
      res.status(404).send("Not Found");
      return;
    }
    const serviceObj = await Service.findById(serviceId).select("-__v").lean();
    if (serviceObj === null) {
      res.status(404).send("Not Found");
      return;
    }

    // Modify trade response to send to the client
    const postOwnerObj = await User.findById(serviceObj.owner)
      .select(globals.POST_OWNER_PROJECTION)
      .lean();
    modifyTradeResponse(serviceObj, postOwnerObj, req.curUser);
    res.send(serviceObj);
  } catch (error) {
    handleError(error, res);
  }
});

/* Create a new service posting. */
jsonApiRouter.post("/services", multipartMiddleware, async (req, res) => {
  try {
    // Validate user input (description, email, phone, and all elements of the
    // tags array must be nonempty strings)
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
    jsonResponse.owner = {};
    addOwnerObjInfo(jsonResponse.owner, req.curUser);
    res.send(jsonResponse);
  } catch (error) {
    // Return 500 Internal server error if error was from uploadImage?
    handleError(error, res);
  }
});

/* Delete a service posting. */
jsonApiRouter.delete("/services/:serviceId", async (req, res) => {
  // deleteEntry handles all the validation and error handling
  deleteEntry(req, res, Service, req.params.serviceId, true);
});

/**************** TRADE ROUTES ****************/
/* Modifies the response object into a format with all the information needed by
 * the frontend. */
const modifyTradeResponse = (response, postOwner, curUser) => {
  response.owner = {};
  addOwnerObjInfo(response.owner, postOwner);

  // Only the post owner can mark completion / delete the post
  response.curUserIsOwner = postOwner._id.toString() === curUser._id.toString();
};

/* Get all trade postings. */
jsonApiRouter.get("/trades", async (req, res) => {
  try {
    const allTradeObjs = await Trade.find()
      .sort({ postTime: "descending" })
      .select("-__v") // remove fields unnecessary for the client
      .lean(); // Don't need to modify the document so just need the JS object
    // Modify array to send to the client
    for (const tradeObj of allTradeObjs) {
      const postOwnerObj = await User.findById(tradeObj.owner)
        .select(globals.POST_OWNER_PROJECTION)
        .lean();
      modifyTradeResponse(tradeObj, postOwnerObj, req.curUser);
    }
    res.send(allTradeObjs);
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
    const tradeObj = await Trade.findById(tradeId).select("-__v").lean();
    if (tradeObj === null) {
      res.status(404).send("Not Found");
      return;
    }

    // Modify trade response to send to the client
    const postOwnerObj = await User.findById(tradeObj.owner)
      .select(globals.POST_OWNER_PROJECTION)
      .lean();
    modifyTradeResponse(tradeObj, postOwnerObj, req.curUser);
    res.send(tradeObj);
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
    modifyTradeResponse(jsonResponse, req.curUser, req.curUser);
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

    // Only the trade owner can modify the trade
    if (trade.owner.toString() !== req.curUser._id.toString()) {
      res.status(403).send("Forbidden");
      return;
    }

    trade.done = true;
    await trade.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
  }
});

/* Delete a trade. */
jsonApiRouter.delete("/trades/:tradeId", async (req, res) => {
  // deleteEntry handles all the validation and error handling
  deleteEntry(req, res, Trade, req.params.tradeId, true);
});

/**************** USER PROFILE ROUTES ****************/
// With users, use username as an identifier in routes, instead of user ObjectId

/* Return the information of the user specified by username. */
jsonApiRouter.get("/users/:username", async (req, res) => {
  try {
    // Validate user input (content must be an nonempty string)
    if (notValidString(req.params.username)) {
      res.status(400).send("Bad Request");
      return;
    }
    // Search for user
    const userObj = await User.findOne({ username: req.params.username })
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

    // Populate friends array with basic user info
    for (let i = 0; i < userObj.friends.length; i++) {
      const friendObj = await User.findById(userObj.friends[i])
        .select(globals.POST_OWNER_PROJECTION)
        .lean();
      userObj.friends[i] = {};
      addOwnerObjInfo(userObj.friends[i], friendObj);
    }

    res.send(userObj);
  } catch (error) {
    handleError(error, res);
  }
});

/* Save user password change. */
jsonApiRouter.put("/users/:username/change-password", async (req, res) => {
  if (req.session.username !== req.params.username) {
    // Comparison validates username; users can only edit their own account
    res.status(403).send("Forbidden");
    return;
  }
  try {
    if (
      typeof req.body.oldPassword !== "string" ||
      req.body.oldPassword.length < 4
    ) {
      res.status(401).send("The entered current password is incorrect");
      return;
    }
    if (
      typeof req.body.newPassword !== "string" ||
      req.body.newPassword.length < 4
    ) {
      // Same check, but different status codes
      res.status(400).send("New password must be at least 4 characters long");
      return;
    }

    // Could create a new static method on User that combines the logic of these
    // two calls, getting less DB latency at the expense of some duplicate code
    const userObj = await User.usernamePasswordValid(
      req.params.username,
      req.body.oldPassword
    );
    const user = await User.findById(userObj._id);
    user.password = req.body.newPassword;
    await user.save();

    res.send({});
  } catch (error) {
    if (error instanceof Error && error.message === "Password did not match") {
      // Error generated by User.usernamePasswordValid()
      res.status(401).send("The entered current password is incorrect");
    } else {
      handleError(error, res);
    }
  }
});

/* Save user status change. */
jsonApiRouter.put("/users/:username/status", async (req, res) => {
  if (req.session.username !== req.params.username) {
    // Comparison validates username; users can only edit their own account
    res.status(403).send("Forbidden");
    return;
  }
  try {
    if (typeof req.body.status !== "string") {
      // Empty string allowed
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
    // Comparison validates username; users can only edit their own account
    res.status(403).send("Forbidden");
    return;
  }
  try {
    // Validate user input
    if (
      notValidString(req.body.actualName) ||
      !["Male", "Female", "Secret"].includes(req.body.gender) ||
      typeof req.body.birthday !== "string" ||
      typeof req.body.location !== "string"
    ) {
      res.status(400).send("Bad Request");
      return;
    }
    // Save settings
    req.curUser.actualName = req.body.actualName;
    req.curUser.gender = req.body.gender;
    req.curUser.birthday = req.body.birthday;
    req.curUser.location = req.body.location;
    // req.curUser.email = req.body.email;
    await req.curUser.save();

    res.send({});
  } catch (error) {
    handleError(error, res);
  }
});

/* Add a new pet to user's profile. */
jsonApiRouter.post("/users/:username/pets", async (req, res) => {
  if (req.session.username !== req.params.username) {
    // Comparison validates username; users can only edit their own account
    res.status(403).send("Forbidden");
    return;
  }
  try {
    // Validate input (likes, dislikes allowed to be empty strings)
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
      description: "", // User can change this field in a later PUT call
    });
    req.curUser.pets.push(newPet);
    await req.curUser.save();

    res.send(newPet.toObject({ versionKey: false }));
  } catch (error) {
    handleError(error, res);
  }
});

/* Save pet information. */
jsonApiRouter.put("/users/:username/pets/:petId", async (req, res) => {
  if (req.session.username !== req.params.username) {
    // Comparison validates username; users can only edit their own account
    res.status(403).send("Forbidden");
    return;
  }
  try {
    // Validate input (likes, dislikes, description allowed to be empty strings)
    if (
      notValidString(req.body.name) ||
      typeof req.body.likes !== "string" ||
      typeof req.body.dislikes !== "string" ||
      typeof req.body.description !== "string"
    ) {
      res.status(400).send("Bad Request");
      return;
    }
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
jsonApiRouter.delete("/users/:username/pets/:petId", async (req, res) => {
  if (req.session.username !== req.params.username) {
    // Comparison validates username; users can only edit their own account
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
jsonApiRouter.put(
  "/users/:username/friends/:friendUsername",
  async (req, res) => {
    if (req.session.username !== req.params.username) {
      // Comparison validates username; users can only edit their own account
      res.status(403).send("Forbidden");
      return;
    }
    try {
      // Validate input (content must be an nonempty string)
      if (notValidString(req.params.friendUsername)) {
        res.status(404).send("Not Found");
        return;
      }
      // Search for user
      const friendObj = await User.findOne({
        username: req.params.friendUsername,
      })
        .select("_id")
        .lean();
      if (friendObj === null) {
        res.status(404).send("Friend username does not exist");
        return;
      }
      const friendId = friendObj._id;

      // Don't add if already friends
      if (req.curUser.friends.includes(friendId)) {
        res.send({}); // Don't send error code for no-op
        return;
      }
      req.curUser.friends.push(friendId);
      await req.curUser.save();

      res.send({});
    } catch (error) {
      handleError(error, res);
    }
  }
);

/* Remove a friend. */
jsonApiRouter.delete(
  "/users/:username/friends/:friendUsername",
  async (req, res) => {
    if (req.session.username !== req.params.username) {
      // Comparison validates username; users can only edit their own account
      res.status(403).send("Forbidden");
      return;
    }
    try {
      // Validate input (content must be an nonempty string)
      if (notValidString(req.params.friendUsername)) {
        res.status(404).send("Not Found");
        return;
      }
      // Search for user
      const friendObj = await User.findOne({
        username: req.params.friendUsername,
      })
        .select("_id")
        .lean();
      if (friendObj === null) {
        res.status(404).send("Friend username does not exist");
        return;
      }
      const friendId = friendObj._id;

      // Only remove friend that exists
      if (!req.curUser.friends.includes(friendId)) {
        res.status(404).send("Not Found");
        return;
      }
      const index = req.curUser.friends.indexOf(friendId);
      req.curUser.friends.splice(index, 1);
      await req.curUser.save();

      res.send({});
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Export the router
module.exports = jsonApiRouter;
