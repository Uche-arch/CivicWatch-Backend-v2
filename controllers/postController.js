// postController.js

const Post = require("../models/Post");

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch {
    res.status(500).json({ msg: "Failed to fetch posts" });
  }
};

// Get the posts created by the logged-in user
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch {
    res.status(500).json({ msg: "Failed to fetch your posts" });
  }
};

exports.createPost = async (req, res) => {
  const { content } = req.body;
  try {
    const newPost = new Post({
      userId: req.user.id,
      username: req.user.username,
      content,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch {
    res.status(500).json({ msg: "Failed to create post" });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: "Post not found" });

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await Post.findByIdAndDelete(postId);
    res.json({ msg: "Post deleted" });
  } catch {
    res.status(500).json({ msg: "Failed to delete post" });
  }
};
