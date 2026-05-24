require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Progress = require('../models/Progress');
const Streak = require('../models/Streak');

const usersData = require('./users.seed');
const introCSData = require('./courses/introCS.seed');
const dsaData = require('./courses/dsa.seed');

function completedChapter(chapterId, objectives) {
  return {
    chapterId,
    currentStage: 'completed',
    stages: {
      tutor:    { completed: true, completedAt: new Date() },
      practice: { completed: true, completedAt: new Date(), score: 85 },
      reverse:  { completed: true, completedAt: new Date(), score: 80, objectivesCovered: objectives },
      quiz:     { completed: true, completedAt: new Date(), score: 88 },
      summary:  { completed: true, completedAt: new Date() },
    },
  };
}

async function seed() {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Chapter.deleteMany({}),
    Progress.deleteMany({}),
    Streak.deleteMany({}),
  ]);

  console.log('Seeding users...');
  const users = await User.insertMany(usersData);
  const userMap = Object.fromEntries(users.map(u => [u.email, u]));

  async function seedCourse(data) {
    const course = await Course.create(data.course);
    const chapters = await Promise.all(
      data.chapters.map(ch => Chapter.create({ ...ch, courseId: course._id }))
    );
    course.chapters = chapters.map(c => c._id);
    await course.save();
    return { course, chapters };
  }

  console.log('Seeding Intro CS...');
  const { course: introCourse, chapters: introChapters } = await seedCourse(introCSData);

  console.log('Seeding DSA...');
  const { course: dsaCourse, chapters: dsaChapters } = await seedCourse(dsaData);

  // Initialize fresh progress for all users on both courses
  console.log('Initializing progress...');
  for (const user of users) {
    for (const [course, chapters] of [[introCourse, introChapters], [dsaCourse, dsaChapters]]) {
      await Progress.create({
        userId: user._id,
        courseId: course._id,
        chapterProgress: chapters.map(ch => ({ chapterId: ch._id, currentStage: 'tutor' })),
      });
    }
  }

  // Pre-seed Sarah: 6 of 7 DSA chapters complete, chapter 7 at quiz — ready to claim certificate
  console.log('Pre-seeding Sarah near-complete DSA progress...');
  const sarah = userMap['sarah@student.io'];
  const sarahDsaProgress = await Progress.findOne({ userId: sarah._id, courseId: dsaCourse._id });

  const COMPLETE_COUNT = 6;
  for (let i = 0; i < COMPLETE_COUNT; i++) {
    sarahDsaProgress.chapterProgress[i] = completedChapter(
      dsaChapters[i]._id,
      dsaData.chapters[i].learningObjectives,
    );
  }

  // Chapter 7 (index 6) — at quiz stage, everything before done
  sarahDsaProgress.chapterProgress[6] = {
    chapterId: dsaChapters[6]._id,
    currentStage: 'quiz',
    stages: {
      tutor:    { completed: true, completedAt: new Date() },
      practice: { completed: true, completedAt: new Date(), score: 90 },
      reverse:  { completed: true, completedAt: new Date(), score: 78, objectivesCovered: dsaData.chapters[6].learningObjectives },
      quiz:     {},
      summary:  {},
    },
  };

  sarahDsaProgress.overallPercent = Math.round((COMPLETE_COUNT / dsaChapters.length) * 100);
  sarahDsaProgress.markModified('chapterProgress');
  await sarahDsaProgress.save();

  // Pre-seed Alex: DSA chapter 1 at reverse tutor stage
  console.log('Pre-seeding Alex at reverse tutor...');
  const alex = userMap['demo@student.io'];
  const alexDsaProgress = await Progress.findOne({ userId: alex._id, courseId: dsaCourse._id });
  alexDsaProgress.chapterProgress[0] = {
    chapterId: dsaChapters[0]._id,
    currentStage: 'reverse',
    stages: {
      tutor:    { completed: true, completedAt: new Date() },
      practice: { completed: true, completedAt: new Date(), score: 80 },
      reverse:  {},
      quiz:     {},
      summary:  {},
    },
  };
  alexDsaProgress.markModified('chapterProgress');
  await alexDsaProgress.save();
  await Streak.create({ userId: alex._id, currentStreak: 2, longestStreak: 4, lastActivityDate: new Date() });

  // Add streaks for demo accounts
  await Streak.create({ userId: sarah._id, currentStreak: 5, longestStreak: 7, lastActivityDate: new Date() });
  await Streak.create({ userId: userMap['jordan@student.io']._id, currentStreak: 3, longestStreak: 3, lastActivityDate: new Date() });

  console.log('Seed complete!');
  console.log(`Users: ${users.map(u => u.email).join(', ')}`);
  console.log(`DSA chapters seeded: ${dsaChapters.length}`);
  console.log(`Sarah DSA progress: ${COMPLETE_COUNT}/${dsaChapters.length} chapters complete, ch7 at quiz`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
