"use strict";

const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  image_id: { type: String, required: true }, // image id on cloudinary server
  image_url: { type: String, required: true }, // image url on cloudinary server
});

// Note: in this file the schema is exported, instead of the model!
module.exports = { ImageSchema };
