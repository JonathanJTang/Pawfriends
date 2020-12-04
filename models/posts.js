const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    owner: String,//user.id
    title: String,
    subtitle: String,
    postTime: String,
    imgLink: String,

});

const Post = mongoose.model('Post', PostSchema);

module.exports = { Post };
