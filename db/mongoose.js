/* Connection to mongo server through the Mongoose API, used in the express
   server. */
const mongoose = require("mongoose");

/* Connnect to our database */
// Get the URI of the local database, or the one specified on deployment.
const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/Pawfriends";

// Query filter properties not in the schema will not be filtered out
// (preparation for Mongoose 7)
mongoose.set('strictQuery', false);
mongoose.connect(mongoURI);

module.exports = { mongoose }; // Export the active connection.
