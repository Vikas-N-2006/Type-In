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
    const { title, body } = req.body;
    if (!title || !body || !req.file) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const blog = new Blog({
      title,
      body,
      coverImageURL: `/uploads/${req.file.filename}`,
      createdBy: req.user._id,
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add this temporarily to check your database
router.get('/debug', async (req, res) => {
  try {
    // Check database connection
    const dbState = mongoose.connection.readyState;
    console.log('Database state:', dbState); // 1 = connected
    
    // Check collection name
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Raw query without populate
    const rawBlogs = await Blog.find({});
    console.log('Raw blogs (no populate):', rawBlogs);
    
    res.json({
      dbState,
      collections: collections.map(c => c.name),
      rawBlogs
    });
  } catch (err) {
    console.error('Debug error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;