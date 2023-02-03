const { mongoose } = require("../../db/mongoose");

/* Checks whether error is a network issue preventing connection to the Mongo
   database. */
const isMongoNetworkError = (error) => {
  return (
    typeof error === "object" &&
    error !== null &&
    error.name === "MongoNetworkError"
  );
};

/* Send the appropriate error in response if something fails in a route body. */
const handleError = (error, res) => {
  if (isMongoNetworkError(error)) {
    res.status(500).send("Internal Server Error");
  } else {
    console.log(error);
    res.status(400).send("Bad request");
  }
};

/* Middleware for mongo connection error for routes that use the database. */
const mongoChecker = (req, res, next) => {
  // check mongoose connection established.
  if (mongoose.connection.readyState != 1) {
    console.log("Issue with mongoose connection");
    res.status(500).send("Internal Server Error");
    return;
  } else {
    next();
  }
};

module.exports = { isMongoNetworkError, handleError, mongoChecker };
