const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  order: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  learningObjectives: [{ type: String }],
  visualizations: [{
    type: { type: String },
    props: { type: mongoose.Schema.Types.Mixed },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Chapter', chapterSchema);
