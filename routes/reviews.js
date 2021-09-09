const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { body, validationResult, check } = require("express-validator");
const User = require("../models/User");
const Review = require("../models/Review");

router.get("/", async (req, res) => {
    try {
        const reviews = await Review.find({}).select("-userId").sort({
            date: -1,
        });
        res.json(reviews);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error!");
    }
});

router.post(
    "/",
    [
        auth,
        [
            check("name", "Please enter the name of the series!")
                .not()
                .isEmpty(),
            check("reviewText", "Please enter a review!").not().isEmpty(),
            check("rating", "Please give the series a rating!").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, reviewText, rating, imgUrl } = req.body;

        try {
            username = await User.findById(req.user.id).select("username");
            const newReview = new Review({
                username: username.username,
                userId: req.user.id,
                name: name,
                imgUrl: imgUrl,
                reviewText: reviewText,
                rating: rating,
            });
            const review = await newReview.save();
            res.json(review);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error!");
        }
    }
);

router.delete("/:id", auth, async (req, res) => {
    try {
        let review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ msg: "Review now found!" });
        }
        if (review.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: "You are not authorized!" });
        }

        await Review.findByIdAndRemove(req.params.id);
        res.json({ msg: "Review has been deleted!" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error!");
    }
});

module.exports = router;
