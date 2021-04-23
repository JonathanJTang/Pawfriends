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
app.use(bodyParser.urlencoded({ extended: true }));

// express-session for managing user sessions
const session = require("express-session");
const MongoStore = require('connect-mongo')(session) // to store session information on the database in production


/// Middleware for creating sessions and session cookies.
app.use(session({
  secret: process.env.NODE_ENV === 'production' ? process.env.EXPRESS_SESSION_SECRET : "test secret", // defined as an environment variable for production
  cookie: { // the session cookie sent, containing the session id.
    expires: 3600000, // 60 minute expiry
    httpOnly: true // important: saves it in only browser's memory - not accessible by javascript (so it can't be stolen/changed by scripts!).
  },
  // Session saving options
  saveUninitialized: false, // don't save the initial session if the session object is unmodified (for example, we didn't log in).
  resave: false, // don't resave an session that hasn't been modified.
  // In production, store sessions in the database
  store: process.env.NODE_ENV === 'production' ? new MongoStore({ mongooseConnection: mongoose.connection }) : null
}));

// CORS setting (for development)
//if (process.env.NODE_ENV !== 'production') {
const cors = require("cors");
app.use(cors());
//}



app.use("/api", require('./routes/jsonRoutes/jsonRoutes'));
app.use(require('./routes/userRoutes/users'))
// app.use(require("./routes/adminRoutes/adminRoutes"));

/* Webpage routes */
// These must be exact routes (not case-sensitive?)
const goodPageRoutesExact = [
  "/",
  "/login",
  "/registration",
  "/home",
  "/settings",
  "/posts",
  "/trades",
  "/services",
  "/admindashboard",
];
// Routes beginning with these strings are acceptable
const goodPageRoutesBeginning = ["/profile/", "/posts/", "/trades/", "/services/"];

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
