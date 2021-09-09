const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    reviewText: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    imgUrl: {
        type: String,
        default: "https://i.imgur.com/YNoZzmJ.png",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("review", ReviewSchema);
