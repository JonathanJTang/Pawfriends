const { mongoose } = require("../../db/mongoose");

// checks for first error returned by promise rejection if Mongo database suddently disconnects
const isMongoError = (error) => {
  return (
    typeof error === "object" &&
    error !== null &&
    error.name === "MongoNetworkError"
  );
};

// Middleware for mongo connection error for routes that use the database
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

module.exports = { isMongoError, mongoChecker };
