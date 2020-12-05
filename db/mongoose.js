/* Connection to mongo server through the Mongoose API, used in the express
   server. */
const mongoose = require("mongoose");

/* Connnect to our database */
// Get the URI of the local database, or the one specified on deployment.
const mongoURI =
  process.env.MONGODB_URI || "***REMOVED***";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

module.exports = { mongoose }; // Export the active connection.
