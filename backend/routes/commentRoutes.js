const express = require("express");

const Comment = require("../models/Comment");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ADD COMMENT
router.post("/", authMiddleware, async (req, res) => {

    try {

        const { comment, postId } = req.body;

        const newComment = new Comment({
            comment,
            post: postId,
            user: req.user.id
        });

        await newComment.save();

        res.status(201).json({
            message: "Comment added successfully",
            newComment
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// GET COMMENTS
router.get("/:postId", async (req, res) => {

    try {

        const comments = await Comment.find({
            post: req.params.postId
        }).populate("user", "username");

        res.status(200).json(comments);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;