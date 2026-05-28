const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();


// CORS FIX
app.use(cors({
    origin: "*"
}));


app.use(express.json());


// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);


// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Server Running");
});


// DATABASE
mongoose.connect(process.env.MONGO_URI)
.then(() => {

    console.log("MongoDB Connected");

})
.catch((err) => {

    console.log(err);

});


// SERVER
app.listen(5000, () => {

    console.log("Server started on port 5000");

});