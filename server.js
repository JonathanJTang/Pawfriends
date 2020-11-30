/** Server for Pawfriends. Portions of code modified from the CSC309 course
 * react-express-authentication repository. */
"use strict";

const express = require("express");
// starting the express server
const app = express();
const path = require("path");

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set("useFindAndModify", false); // for some deprecation issues

// import the mongoose models
const { User } = require("./models/user");

// to validate object IDs
// const { ObjectID } = require("mongodb");

// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// express-session for managing user sessions
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));

// CORS setting (for development)
const cors = require("cors");
app.use(cors());

function isMongoError(error) {
  // checks for first error returned by promise rejection if Mongo database suddently disconnects
  return (
    typeof error === "object" &&
    error !== null &&
    error.name === "MongoNetworkError"
  );
}

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

/* API routes */

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
