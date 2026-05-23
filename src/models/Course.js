const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  coverColor: { type: String, default: 'primary' },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
