const express = require("express");

const Post = require("../models/Post");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE POST
router.post("/", authMiddleware, async (req, res) => {

    try {

        const { title, content } = req.body;

        const newPost = new Post({
            title,
            content,
            author: req.user.id
        });

        await newPost.save();

        res.status(201).json({
            message: "Post created successfully",
            newPost
        });

    } catch(error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// GET ALL POSTS
router.get("/", async (req, res) => {

    try {

        const posts = await Post.find()
            .populate("author", "username");

        res.status(200).json(posts);

    } catch(error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// UPDATE POST
router.put("/:id", authMiddleware, async (req, res) => {

    try {

        const { title, content } = req.body;

        const updatedPost =
            await Post.findByIdAndUpdate(
                req.params.id,
                {
                    title,
                    content
                },
                { new: true }
            );

        res.status(200).json({
            message: "Post updated successfully",
            updatedPost
        });

    } catch(error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// DELETE POST
router.delete("/:id", authMiddleware, async (req, res) => {

    try {

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Post deleted successfully"
        });

    } catch(error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;