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
  likes: String,
  dislikes: String,
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
    select: false, // don't include in query results by default
  },
  actualName: {
    type: String,
    required: true,
  },
  // TODO: do we make some of the fields below required?
  birthday: { type: String },
  gender: {
    type: String,
    enum: ["Male", "Female", "Secret"],
  },
  location: { type: String },
  profilePicture: ImageSchema,
  status: String,
  pets: [PetSchema],
  friends: [ObjectId],
  settings: { type: Map, of: String },
  admin: Boolean,
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

/* Determine whether the username-password combination is valid,
   by comparing the stored hashed password to the input one.
   This method is used when logging in. */
UserSchema.statics.usernamePasswordValid = function (username, password) {
  const User = this; // binds this to the User model

  if (!username || !password) {
    return Promise.reject();
  }

  // First find the user by their username
  return User.findOne(
    { username: username },
    { username: 1, password: 1 } // Projection to include the password field
  ).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    // If the user exists, make sure their password is correct
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          resolve(
            user.toObject({
              transform: (doc, objRep, options) => {
                delete objRep.password;  // Don't expose this to other functions
                return objRep;
              },
            })
          );
        } else {
          reject("Password did not match");
        }
      });
    });
  });
};

// make a model using the User schema
const User = mongoose.model("User", UserSchema);
const Pet = mongoose.model("Pet", PetSchema);
module.exports = { User, Pet };
