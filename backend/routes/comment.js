const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const authenticate = require('../middlewares/authentication');

router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy', 'fullName profileImageURL');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });
    const comment = new Comment({
      content,
      blogId: req.params.id,
      createdBy: req.user._id,
    });
    await comment.save();
    const populatedComment = await Comment.findById(comment._id).populate('createdBy', 'fullName profileImageURL');
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;