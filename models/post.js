/* Model for posts. Each post contains metadata, a title and text context,
 * and optionally images, comments, and users who liked the post. */
"use strict";

const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { ImageSchema } = require("./image");

const CommentSchema = new mongoose.Schema({
  owner: { type: ObjectId, required: true }, // user._id
  content: { type: String, required: true },
});

const PostSchema = new mongoose.Schema({
  owner: { type: ObjectId, required: true }, // user._id
  postTime: { type: Date, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  likedUsers: [ObjectId],
  images: [ImageSchema],
  comments: [CommentSchema],
});

const Post = mongoose.model("Post", PostSchema);

module.exports = { Post };
