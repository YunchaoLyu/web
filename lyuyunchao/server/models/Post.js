// models/Post.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Set required to true
  title: { type: String, required: true },
  content: { type: String, required: true },
  // Add to your existing Post schema
comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
,
  image: { type: String }, // Path to the image
}, { timestamps: true }); // Enable automatic handling of createdAt and updatedAt


module.exports = mongoose.model('Post', PostSchema);
