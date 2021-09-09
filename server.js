const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
connectDB();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
    );
}

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
