/** Server for Pawfriends. Portions of code modified from the CSC309 course
 * react-express-authentication and cloudinary-mongoose-react repositories. */
"use strict";

const express = require("express");
// starting the express server
const app = express();
const path = require("path");
const jsonApiRouter = express.Router();

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set("useFindAndModify", false); // for some deprecation issues

// import the mongoose models
const { User } = require("./models/user");
const { Post } = require("./models/post");
const { Service } = require("./models/service");
const { Trade } = require("./models/trade");

// to validate object IDs
const { ObjectID } = require("mongodb");

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// multipart middleware: allows you to access uploaded file from req.file
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

// cloudinary: configure using credentials found on your Cloudinary Dashboard
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "dypmf5kee",
  api_key: "666517587772385",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// express-session for managing user sessions
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));

/// Middleware for creating sessions and session cookies.
// A session is created on every request, but whether or not it is saved depends on the option flags provided.
app.use(session({
  secret: '***REMOVED***', // later we will define the session secret as an environment variable for production. for now, we'll just hardcode it.
  cookie: { // the session cookie sent, containing the session id.
      expires: 60000, // 1 minute expiry
      httpOnly: true // important: saves it in only browser's memory - not accessible by javascript (so it can't be stolen/changed by scripts!).
  },
  // Session saving options
  saveUninitialized: false, // don't save the initial session if the session object is unmodified (for example, we didn't log in).
  resave: false, // don't resave an session that hasn't been modified.
}));

// CORS setting (for development)
const cors = require("cors");
app.use(cors());

// Global object
const globals = {};
globals.defaultAvatar = {
  image_id: "pawfriends/defaultAvatar_sflv0g.png",
  image_url:
    "https://res.cloudinary.com/dypmf5kee/image/upload/v1607124490/pawfriends/defaultAvatar_sflv0g.png",
};

/* Middleware */
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

// // Middleware for authentication of resources
// const authenticate = (req, res, next) => {
//   if (req.session.user) {
//     // User.findById(req.session.user)
//     //   .then((user) => {
//     //     if (!user) {
//     //       return Promise.reject();
//     //     } else {
//     //       req.user = user;
//     //       next();
//     //     }
//     //   })
//     //   .catch((error) => {
//     //     res.status(401).send("Unauthorized");
//     //   });
//   } else {
//     res.status(401).send("Unauthorized");
//   }
// };

// Create a session and session cookie
app.use(
  session({
    secret: "***REMOVED***",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60000,
      httpOnly: true,
    },
  })
);

/* API routes
 * Note: these are defined on the jsonApiRouter express router, which is loaded
 * on the "/api" url prefix already */
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
// jsonApiRouter.use(authenticate);  // TODO: enable when authenticate is done

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
      { folder: "Pawfriends" },
      function (error, result) {
        console.log(error, result);
        if (error) {
          reject(null); // TODO: finish & test
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

/* Create a new post */
jsonApiRouter.post("/posts", multipartMiddleware, async (req, res) => {
  // const username = req.session.username;
  const username = "user"; // TODO: remove after authentication is implemented
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
    console.log("req.files: ", req.files);
    if (req.files && req.files.image !== undefined) {
      // There's an uploaded image, upload it to the Cloudinary server.
      console.log("imagePath: ", req.files.image.path);
      const imageInfo = await uploadImage(req.files.image.path);
      post.images.push(imageInfo);
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
  // const username = req.session.username;
  const username = "user"; // TODO: remove after authentication is implemented
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
  // const username = req.session.username;
  const username = "user"; // TODO: remove after authentication is implemented
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
  // const username = req.session.username;
  const username = "user"; // TODO: remove after authentication is implemented
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

// get all posts from the selected user
// TODO: Jonathan -- this route needs to be updated with the same logic
// in the GET /posts handler

// jsonApiRouter.get("/users/:username/posts", async (req, res) => {
//   const username = req.params.username;
//   try {
//     // Authentication passed, meaning user is valid
//     const user = await User.findOne({ username: username });
//     // could use .limit to limit the number of items to return
//     const userPosts = await Post.find({ owner: user._id }).sort({
//       postTime: "descending",
//     });
//     console.log(userPosts);
//     res.send(userPosts);
//   } catch (error) {
//     handleError(error, res);
//   }
// });

const deleteImage = (imageInfo) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(imageInfo.image_id, function (error, result) {
      console.log(error, result);
      if (error) {
        reject(null); // TODO: finish & test
      } else {
        resolve();
      }
    });
  });
};

// Delete a post
jsonApiRouter.delete("posts/:postId", async (req, res) => {
  // const username = req.session.username;
  const username = "user"; // TODO: remove after authentication
  const postId = req.params.postId;
  try {
    if (!ObjectID.isValid(postId)) {
      res.status(404).send();
      return;
    }
    const post = await Post.findByIdAndDelete(postId);
    if (post === null) {
      res.status(404).send();
      return;
    }

    // Authentication passed, meaning user is valid
    const user = await User.findOne({ username: username });

    // Only the post owner can delete the post
    if (post.owner.toString() !== user._id.toString) {
      res.status(403).send();
      return;
    }

    post.images.forEach((imageInfo) => {
      // Use uploader.destroy API to delete image from cloudinary server.
      deleteImage(imageInfo);
    });
    res.send();
  } catch (error) {
    // TODO: return 500 Internal server error if error was from deleteImage?
    handleError(error, res);
  }
});

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

// get all trade postings
jsonApiRouter.get("/trades", async (req, res) => {
  try {
    // could use .limit to limit the number of items to return
    const allTrades = await Trade.find().sort({ postTime: "descending" });
    res.send(allTrades);
  } catch (error) {
    handleError(error, res);
  }
});

app.use("/api", jsonApiRouter);
app.use(require('./routes/users'))

/* Webpage routes */
// These must be exact routes (not case-sensitive?)
const goodPageRoutesExact = [
  "/",
  "/login",
  "/home",
  "/admindashboard",
  "/registration",
  "/settings",
  "/caretakers",
  "/trade",
  "/posts",
];
// Routes beginning with these strings are acceptable
const goodPageRoutesBeginning = ["/profile/"];

// Serve the build
app.use(express.static(path.join(__dirname, "/pawfriends/build")));

app.get("*", (req, res) => {
  // check for page routes that we expect in the frontend to provide correct status code.
  if (
    !goodPageRoutesExact.includes(req.url.toLowerCase()) &&
    !goodPageRoutesBeginning.some((str) =>
      req.url.toLowerCase().startsWith(str)
    )
  ) {
    // if url not in expected page routes, set status to 404.
    res.status(404);
  }

  // send index.html
  res.sendFile(path.join(__dirname, "/pawfriends/build/index.html"));
});

/* Express server to start listening */
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
