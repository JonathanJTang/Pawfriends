/** Server for Pawfriends. Portions of code modified from the CSC309 course
 * react-express-authentication and cloudinary-mongoose-react repositories. */
"use strict";

const express = require("express");
// starting the express server
const app = express();
const path = require("path");

// mongoose and mongo connection
const { mongoose } = require("./db/mongoose");
mongoose.set("useFindAndModify", false); // for some deprecation issues


// body-parser: middleware for parsing HTTP JSON body into a usable object
const bodyParser = require("body-parser");
app.use(bodyParser.json());

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



app.use("/api", require('./routes/jsonRoutes/jsonRoutes'));
app.use(require('./routes/userRoutes/users'))

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
