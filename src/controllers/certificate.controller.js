const Progress = require('../models/Progress');
const Course = require('../models/Course');
const { issueCertificate } = require('../services/certificate.service');

const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

exports.issue = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id;

  const progress = await Progress.findOne({ userId, courseId });
  if (!progress) return res.status(400).json({ error: 'No progress found for this course' });

  const allComplete = progress.chapterProgress.every(cp => cp.currentStage === 'completed');
  if (!allComplete) return res.status(400).json({ error: 'Not all chapters complete' });

  if (progress.certificateIssued) {
    return res.json({
      pdfUrl: `/certificates/${userId}-${courseId}.pdf`,
      txHash: progress.certificateTxHash,
    });
  }

  const course = await Course.findById(courseId);
  const { filename, txHash } = await issueCertificate(userId, courseId, course.title, req.user.name);

  res.json({ pdfUrl: `/certificates/${filename}`, txHash });
});
