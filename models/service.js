"use strict";

const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { ImageSchema } = require("./image");

const ServiceSchema = new mongoose.Schema({
  owner: { type: ObjectId, required: true }, //user._id
  postTime: { type: Date, required: true },
  title: { type: String, required: true },
  tags: [String],
  taskTaker: { type: ObjectId, required: true }, // a user id?
});

const Service = mongoose.model("Service", ServiceSchema);

module.exports = { Service };
