"use strict";

const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const { ImageSchema } = require("./image");

const TradeSchema = new mongoose.Schema({
  owner: { type: ObjectId, required: true }, // user._id
  postTime: { type: Date, required: true },
  title: { type: String, required: true },
  images: [ImageSchema],
  done: { type: Boolean, required: true },
});

const Trade = mongoose.model("Trade", TradeSchema);

module.exports = { Trade };
