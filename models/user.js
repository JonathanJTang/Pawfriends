/* User model. Portions of code modified from the CSC309 course
 * react-express-authentication repository. */
"use strict";

const mongoose = require("mongoose");
// const validator = require('validator')
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");

const { ImageSchema } = require("./image");

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  likes: { type: String, required: true },
  dislikes: { type: String, required: true },
  description: String,
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4, // to allow course required passwords
  },
  actualName: {
    type: String,
    required: true,
  },
  // TODO: do we make some of the fields below required?
  gender: {
    type: String,
    enum: ["Male", "Female", "Secret"],
  },
  location: { type: String },
  birthday: { type: String },
  profilePicture: ImageSchema,
  status: String,
  pets: [PetSchema],
  friends: [ObjectId],
  settings: { type: Map, of: String },
});

// Mongoose middleware
UserSchema.pre("save", function (next) {
  const user = this; // binds this to User document instance

  // checks to ensure we don't hash password more than once
  if (user.isModified("password")) {
    // generate salt and hash the password
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// Find a User document by comparing the hashed password to a given one,
// for example when logging in.
UserSchema.statics.findByUsernamePassword = function (username, password) {
  const User = this; // binds this to the User model

  // First find the user by their email
  return User.findOne({ username: username }).then((user) => {
    if (!user) {
      return Promise.reject(); // a rejected promise
    }
    // if the user exists, make sure their password is correct
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

// make a model using the User schema
const User = mongoose.model("User", UserSchema);
module.exports = { User };
