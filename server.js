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

// CORS setting (for development)
const cors = require("cors");
app.use(cors());

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

// Middleware for authentication of resources
const authenticate = (req, res, next) => {
  if (req.session.user) {
    // User.findById(req.session.user)
    //   .then((user) => {
    //     if (!user) {
    //       return Promise.reject();
    //     } else {
    //       req.user = user;
    //       next();
    //     }
    //   })
    //   .catch((error) => {
    //     res.status(401).send("Unauthorized");
    //   });
  } else {
    res.status(401).send("Unauthorized");
  }
};

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

// Image helper functions
const uploadImage = (imagePath) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imagePath, // req.files contains uploaded files
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

// Create a new post
jsonApiRouter.post(
  "/users/:username/posts",
  multipartMiddleware,
  async (req, res) => {
    const username = req.params.username;
    try {
      // Authentication passed, meaning user is valid
      const user = await User.findOne({ username: username });

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

      const post = new Post({
        owner: user._id,
        postTime: new Date(), // use current server time
        title: req.body.title,
        content: req.body.content,
        images: [], // TODO: implement image upload functionality
        comments: [],
      });
      console.log(req.files);
      if (req.files && req.files.image !== undefined) {
        // Use uploader.upload API to upload image to cloudinary server.
        console.log("imagePath: ", req.files.image.path);
        const imageInfo = await uploadImage(req.files.image.path);
        post.images.push(imageInfo);
      }
      const newPost = await post.save();
      res.send(newPost); // TODO: needed?
    } catch (error) {
      // TODO: return 500 Internal server error if error was from uploadImage
      handleError(error, res);
    }
  }
);

// get all posts from the current user
jsonApiRouter.get("/users/:username/posts", async (req, res) => {
  const username = req.params.username;
  try {
    // Authentication passed, meaning user is valid
    const userPosts = await Post.find({ owner: username._id });
    console.log(userPosts);
    res.send(userPosts);
  } catch (error) {
    handleError(error, res);
  }
});

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
jsonApiRouter.delete("/users/:username/posts/:postId", async (req, res) => {
  const username = req.params.username;
  const postId = req.params.postId;
  try {
    if (!ObjectID.isValid(postId)) {
      res.status(404).send();
      return;
    }
    // Authentication passed, meaning user is valid
    // const user = await User.findOne({ username: username });

    const post = await Post.findByIdAndDelete(postId);
    if (post === null) {
      res.status(404).send();
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
    const allServices = await Service.find().sort({ postTime: "ascending" });
    res.send(allServices);
  } catch (error) {
    handleError(error, res);
  }
});

// get all trade postings
jsonApiRouter.get("/trades", async (req, res) => {
  try {
    // could use .limit to limit the number of items to return
    const allTrades = await Trade.find().sort({ postTime: "ascending" });
    res.send(allTrades);
  } catch (error) {
    handleError(error, res);
  }
});

app.use("/api", jsonApiRouter);

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
