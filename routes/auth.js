const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");
const { body, validationResult, check } = require("express-validator");
const User = require("../models/User");

router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error!");
    }
});

router.post(
    "/",
    [
        check("username", "A username is required").exists(),
        check("password", "A password is required").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            let user = await User.findOne({ username: username });
            if (!user) {
                return res
                    .status(400)
                    .json({ error: "Invalid username or password" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ error: "Invalid username or password" });
            }

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
