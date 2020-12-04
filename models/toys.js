const mongoose = require('mongoose');

const ToySchema = new mongoose.Schema({
    owner: String,//user.id
    title: String,
    postTime: String,
    toyImgLink: String,
});

const Toy = mongoose.model('Toy', ToySchema);

module.exports = { CareTaker };
