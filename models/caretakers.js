const mongoose = require('mongoose');

const CareTakerSchema = new mongoose.Schema({
    requester: String,//user.id
    title: String,
    postTime: String,
    taskTaker: String,

});

const CareTaker = mongoose.model('CareTaker', CareTakerSchema);

module.exports = { CareTaker };
