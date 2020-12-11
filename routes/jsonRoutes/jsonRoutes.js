
// express
const express = require('express');
const jsonApiRouter = express.Router(); // Express Router

// multipart middleware: allows you to access uploaded file from req.file
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

const fs = require('fs');

// import the mongoose models
const { User, Pet } = require("../../models/user");
const { Post } = require("../../models/post");
const { Service } = require("../../models/service");
const { Trade } = require("../../models/trade");

// to validate object IDs
const { mongoose } = require("../../db/mongoose");
const { ObjectID } = require("mongodb");

// cloudinary: configure using credentials found on the Cloudinary Dashboard
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dypmf5kee",
  api_key: "666517587772385",
  api_secret: "***REMOVED***",
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

// Middleware for mongo connection error for routes that need it
const mongoChecker = (req, res, next) => {
    // check mongoose connection established.
    if (mongoose.connection.readyState != 1) {
      console.log("Issue with mongoose connection");
      res.status(500).send("Internal server error");
      return;
    } else {
      next();
    }
  };


/**************** HELPERS FOR API ROUTES ****************/
 const isMongoError = (error) => {
    // checks for first error returned by promise rejection if Mongo database suddently disconnects
    return (
      typeof error === "object" &&
      error !== null &&
      error.name === "MongoNetworkError"
    );
  };
  
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
  
  /* Modifies the 'owner' key of the response object into a format with all the
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
      const commentOwnerId = comment.owner;
      const commentOwner = await User.findById(commentOwnerId);
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
      cloudinary.uploader.destroy(imageInfo.image_id,
        {invalidate: true},
        function (error, result) {
        console.log(error, result);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };


/**************** API ROUTES for updating various objs in database (Posts, Services, Trades) ****************/
/* API routes
* Note: these are defined on the jsonApiRouter express router, which is loaded
* on the "/api" url prefix already */

/**************** POSTS ROUTES ****************/

  /* Create a new post */
  jsonApiRouter.post("/posts", multipartMiddleware, async (req, res) => {
    const username = req.session.username;
    // const username = "user"; // TODO: remove after authentication is implemented
    try {
      // Validate user input (title and content must be nonempty strings)
      if (
        typeof req.body.title !== "string" ||
        typeof req.body.content !== "string" ||
        req.body.title === "" ||
        req.body.content === ""
      ) {
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
        images: [], // TODO: implement image upload functionality
        comments: [],
      });
      if (req.files) {
        // There's an uploaded image, upload it to the Cloudinary server.

        if (req.files.image !== undefined && globals.validImageFileTypes.includes(image.name.split(".").pop().toLowerCase())) {
          const imageInfo = await uploadImage(req.files.image.path);
          post.images.push(imageInfo);
        }
        // Delete temporary files in req.files to not take up space on server
        for (const key in req.files) {
          fs.unlink(req.files[key].path, (error) => {if (error){console.log(error)}});
        }
      }
      const newPost = await post.save();
      // Build the JSON object to respond with
      const jsonReponse = newPost.toObject();
      delete jsonReponse["__v"];
      await modifyPostReponse(jsonReponse, user, user);
      res.send(jsonReponse);
    } catch (error) {
      // TODO: return 500 Internal server error if error was from uploadImage
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
      if (typeof req.body.content !== "string" || req.body.content === "") {
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
  
  // get all posts (limit to the current user + the current user's friends?)
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
      // userPosts.forEach(async (post) => {});
      for (const post of userPosts) {
        const ownerId = post.owner;
        const postOwner = await User.findById(ownerId);
        await modifyPostReponse(post, postOwner, curUser);
      }
      res.send(userPosts);
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
        await deleteImage(image)
      }
      post.remove();
      res.send();
    } catch (error) {
      // TODO: return 500 Internal server error if error was from deleteImage?
      handleError(error, res);
    }
  });
  
  /**************** SERVICE ROUTES ****************/

  // get all service postings
  jsonApiRouter.get("/services", async (req, res) => {
    try {
      // could use .limit to limit the number of items to return
      const allServices = await Service.find().sort({ postTime: "descending" });
      res.send(allServices);
    } catch (error) {
      handleError(error, res);
    }
  });
  
  /* Modifies the response object into a format with all the information needed by
   * the frontend. */
  const modifyTradeReponse = async (response, postOwner, curUser) => {
    addOwnerToResponse(response, postOwner);
};
  
/**************** TRADE ROUTES ****************/
  
  // get all trade postings
  jsonApiRouter.get("/trades", async (req, res) => {
    // const username = req.session.username;
    const username = "user"; // TODO: remove after authentication is implemented
    try {
      // Authentication passed, meaning user is valid
      const curUser = await User.findOne({ username: username });
  
      // could use .limit() before .lean() to limit the number of items to return
      const userPosts = await Trade.find()
        .sort({
          postTime: "descending",
        })
        .select("-__v") // remove fields unnecessary for the client
        .lean();
      // Modify array to send to the client
      // userPosts.forEach(async (post) => {});
      for (const post of userPosts) {
        const ownerId = post.owner;
        const postOwner = await User.findById(ownerId);
        await modifyTradeReponse(post, postOwner, curUser);
      }
      res.send(userPosts);
    } catch (error) {
      handleError(error, res);
    }
  });
  
  /* Create a new trade */
  jsonApiRouter.post("/trades", multipartMiddleware, async (req, res) => {
    // const username = req.session.username;
    const username = "user"; // TODO: remove after authentication is implemented
    try {
      // Validate user input (title and content must be nonempty strings)
      if (
        typeof req.body.title !== "string" ||
        req.body.title === ""
      ) {
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
        images: [], // TODO: implement image upload functionality
        done: false,
      });
      // console.log("req.files: ", req.files);
      // if (req.files && req.files.image !== undefined) {
      //   // There's an uploaded image, upload it to the Cloudinary server.
      //   console.log("imagePath: ", req.files.image.path);
      //   const imageInfo = await uploadImage(req.files.image.path);
      //   post.images.push(imageInfo);
      // }
      const newTrade = await trade.save();
      // Build the JSON object to respond with
      const jsonReponse = newTrade.toObject();
      delete jsonReponse["__v"];
      await modifyTradeReponse(jsonReponse, user, user);
      res.send(jsonReponse);
    } catch (error) {
      // TODO: return 500 Internal server error if error was from uploadImage
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
  
      trade.images.forEach((imageInfo) => {
        // Use uploader.destroy API to delete image from cloudinary server.
        deleteImage(imageInfo);
      });
      res.send({});
    } catch (error) {
      // TODO: return 500 Internal server error if error was from deleteImage?
      handleError(error, res);
    }
  });

  /* Return User object that matches username */
jsonApiRouter.get("/users/:username", async (req, res) => {
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
  
      // Temporary, add fields to user on registration
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
    try {
      const user = await User.findOne({ username: username });
      // validate
      if (user === null) {
        res.status(404).send();
        return;
      }
      if (
        typeof req.body.status !== "string"
      ) {
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
  
  // Add a new pet to user's profile
  jsonApiRouter.post("/users/:userId/pets", async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (user === null) {
        res.status(404).send();
        return;
      }
      if (
        typeof req.body.name !== "string" ||
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
        description: "Write anything about your pet here"
      })
      user.pets.push(newPet);
      user.save();
      res.send(newPet);
    } catch (error) {
      handleError(error, res);
    }
  });
  
  // Save pet information
  jsonApiRouter.put("/users/:userId/:petId", async (req, res) => {
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
      console.log("hmm")
    }
  });
  
  // Delete a pet
  jsonApiRouter.delete("/users/:userId/:petId", async (req, res) => {
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
      console.log("hmm")
    }
  });
  

  // export the router
module.exports = jsonApiRouter