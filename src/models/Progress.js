const mongoose = require('mongoose');

const stageDataSchema = new mongoose.Schema({
  completed: { type: Boolean, default: false },
  score: { type: Number },
  objectivesCovered: [{ type: String }],
  completedAt: { type: Date },
}, { _id: false });

const chapterProgressSchema = new mongoose.Schema({
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
  currentStage: {
    type: String,
    enum: ['tutor', 'practice', 'reverse', 'quiz', 'summary', 'completed'],
    default: 'tutor',
  },
  stages: {
    tutor:    { type: stageDataSchema, default: () => ({}) },
    practice: { type: stageDataSchema, default: () => ({}) },
    reverse:  { type: stageDataSchema, default: () => ({}) },
    quiz:     { type: stageDataSchema, default: () => ({}) },
    summary:  { type: stageDataSchema, default: () => ({}) },
  },
}, { _id: false });

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  chapterProgress: [chapterProgressSchema],
  overallPercent: { type: Number, default: 0 },
  certificateIssued: { type: Boolean, default: false },
  certificateTxHash: { type: String },
}, { timestamps: true });

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
