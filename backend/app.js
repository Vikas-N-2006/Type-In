require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');
const commentRoutes = require('./routes/comment');

const app = express();

app.use('/static', express.static('public'));

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));
app.use('/images', express.static('public/images'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', commentRoutes);
app.use('/api/blogs', blogRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
