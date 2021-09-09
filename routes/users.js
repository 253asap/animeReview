const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { body, validationResult, check } = require("express-validator");
const User = require("../models/User");

router.post(
    "/",
    [
        check("username", "Please enter a username").not().isEmpty(),
        check(
            "username",
            "Please enter a username with 10 characters or less"
        ).isLength({ max: 10 }),
        check(
            "password",
            "Please enter a password with 5 or more characters"
        ).isLength({ min: 5 }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            let user = await User.findOne({ username: username });

            if (user) {
                return res.status(400).json({ error: "User already exists!" });
            }

            user = new User({
                username: username,
                password: password,
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                },
            };

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                {
                    expiresIn: 86400,
                },
                (error, token) => {
                    if (error) {
                        throw error;
                    } else {
                        res.json({ token: token });
                    }
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error!");
        }
    }
);

module.exports = router;
