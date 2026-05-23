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

  // Initialize progress for all users on both courses
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

  // Pre-seed Sarah's DSA progress: 2 of 3 chapters complete, 3rd at quiz stage
  console.log('Pre-seeding Sarah near-complete DSA progress...');
  const sarah = userMap['sarah@student.io'];
  const sarahDsaProgress = await Progress.findOne({ userId: sarah._id, courseId: dsaCourse._id });

  const completedStages = { completed: true, completedAt: new Date(), score: 85 };
  sarahDsaProgress.chapterProgress[0] = {
    chapterId: dsaChapters[0]._id,
    currentStage: 'completed',
    stages: {
      tutor: { completed: true, completedAt: new Date() },
      exercise1: completedStages,
      reverseTutor: { ...completedStages, objectivesCovered: dsaData.chapters[0].learningObjectives },
      exercise2: completedStages,
      quiz: { ...completedStages, score: 80 },
      summary: { completed: true, completedAt: new Date() },
    },
  };
  sarahDsaProgress.chapterProgress[1] = {
    chapterId: dsaChapters[1]._id,
    currentStage: 'completed',
    stages: {
      tutor: { completed: true, completedAt: new Date() },
      exercise1: completedStages,
      reverseTutor: { ...completedStages, objectivesCovered: dsaData.chapters[1].learningObjectives },
      exercise2: completedStages,
      quiz: { ...completedStages, score: 90 },
      summary: { completed: true, completedAt: new Date() },
    },
  };
  sarahDsaProgress.chapterProgress[2] = {
    chapterId: dsaChapters[2]._id,
    currentStage: 'quiz',
    stages: {
      tutor: { completed: true, completedAt: new Date() },
      exercise1: completedStages,
      reverseTutor: { ...completedStages, objectivesCovered: dsaData.chapters[2].learningObjectives },
      exercise2: completedStages,
    },
  };
  sarahDsaProgress.overallPercent = 67;
  sarahDsaProgress.markModified('chapterProgress');
  await sarahDsaProgress.save();

  // Add streaks for Sarah and Jordan for demo
  await Streak.create({ userId: sarah._id, currentStreak: 5, longestStreak: 7, lastActivityDate: new Date() });
  await Streak.create({ userId: userMap['jordan@student.io']._id, currentStreak: 3, longestStreak: 3, lastActivityDate: new Date() });

  console.log('Seed complete!');
  console.log(`Users: ${users.map(u => u.email).join(', ')}`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
