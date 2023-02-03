/* Schema for images uploaded / retrieved from the Cloudinary server. */
"use strict";

const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  imageId: { type: String, required: true }, // image id on cloudinary server
  imageUrl: { type: String, required: true }, // image url on cloudinary server
});

// Note: in this file the schema is exported, instead of the model!
module.exports = { ImageSchema };
