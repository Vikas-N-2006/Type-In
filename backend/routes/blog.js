const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');
const authenticate = require('../middlewares/authentication');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().populate('createdBy', 'fullName profileImageURL');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('createdBy', 'fullName profileImageURL');
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content || !req.file) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const blog = new Blog({
      title,
      content,
      coverImageURL: `/uploads/${req.file.filename}`,
      createdBy: req.user._id,
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
