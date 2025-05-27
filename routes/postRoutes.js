// postRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getPosts,
  getUserPosts, // <-- Import the function to get user's posts
  createPost,
  deletePost,
} = require("../controllers/postController");

// Get all posts
router.get("/", getPosts);

// Get posts of the logged-in user
router.get("/my-posts", auth, getUserPosts); // <-- New route

// Create a new post (only logged-in users)
router.post("/", auth, createPost);

// Delete a post (only post creator)
router.delete("/:id", auth, deletePost);

module.exports = router;
