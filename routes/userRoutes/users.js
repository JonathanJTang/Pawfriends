/** User routes */

// Express
const express = require("express");
const router = express.Router(); // Express Router

// Import the user mongoose model
const { User } = require("../../models/user");

// Import helpers and types
const {
  notValidString,
  isMongoNetworkError,
  handleError,
  mongoChecker,
} = require("../helpers/routeHelpers");

/*** User API routes ***/
router.post("/users", mongoChecker, async (req, res) => {
  try {
    // Only allow alphanumeric usernames with length >= 4
    if (!req.body.username.match(/^[0-9a-zA-Z]+$/)) {
      res
        .status(400)
        .send(
          "Username must be composed of 1 or more alphanumeric characters (0-9, a-z, A-Z)"
        );
      return;
    }
    if (typeof req.body.password !== "string" || req.body.password.length < 4) {
      res.status(400).send("Password must be at least 4 characters long");
      return;
    }

    // Create a new user
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      actualName: req.body.actualName,
      gender: req.body.gender,
      birthday: req.body.birthday,
    });

    // Save the user
    const newUser = await user.save();
    res.send(newUser.toObject({ versionKey: false, useProjection: true }));
  } catch (error) {
    if (isMongoNetworkError(error)) {
      res.status(500).send("Internal Server Error");
    } else if (
      typeof error === "object" &&
      error !== null &&
      error.name === "ValidationError"
    ) {
      // A field doesn't match the schema's requirements
      res
        .status(403)
        .send("A field does not meet the requirements for user registration");
    } else if (
      typeof error === "object" &&
      error !== null &&
      error.name === "MongoServerError" &&
      error.code === 11000
    ) {
      // Duplicate key error for the given username, generated by MongoDB
      res
        .status(403)
        .send(`The username '${req.body.username}' is unavailable`);
    } else {
      res.status(400).send("Bad Request");
    }
  }
});

/*** Login and Logout routes ***/
//A route to login and create a session
router.post("/users/login", mongoChecker, async (req, res) => {
  try {
    // Validate user input: username and password must be nonempty strings
    if (
      notValidString(req.body.username) ||
      notValidString(req.body.password)
    ) {
      res.status(400).send("Bad Request");
      return;
    }

    // Use the static method on the User model to find a user
    // by their username and password.
    const user = await User.usernamePasswordValid(
      req.body.username,
      req.body.password
    );

    if (!user) {
      res.status(401).send("No such username and password combination");
    } else {
      // Add the user's id and username to the session.
      // We can check later if the session exists to ensure we are logged in.
      req.session.userId = user._id;
      req.session.username = user.username;
      req.session.isAdmin = user.admin;
      res.send({ currentUsername: user.username, isAdmin: user.admin });
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Password did not match") {
      res.status(401).send("The entered current password is incorrect");
    } else {
      handleError(error, res);
    }
  }
});

// A route to logout a user
router.get("/users/logout", (req, res) => {
  // Remove the session
  req.session.destroy((error) => {
    if (error) {
      res.status(500).send("Internal Server Error");
    } else {
      res.send(); // Successfully logged out
    }
  });
});

// A route to check if a user is logged in on the session
router.get("/users/check-session", (req, res) => {
  if (req.session.userId) {
    res.send({
      currentUsername: req.session.username,
      isAdmin: req.session.isAdmin,
    });
  } else {
    res.status(401).send("Unauthorized");
  }
});

// Export the router
module.exports = router;
