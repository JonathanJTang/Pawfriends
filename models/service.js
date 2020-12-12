"use strict";

const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { ImageSchema } = require("./image");

const ServiceSchema = new mongoose.Schema({
  owner: { type: ObjectId, required: true }, //user._id
  postTime: { type: Date, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  tags: [String],
  images: [ImageSchema],
  taskTaker: { type: ObjectId }, // a user._id
});

const Service = mongoose.model("Service", ServiceSchema);

module.exports = { Service };
