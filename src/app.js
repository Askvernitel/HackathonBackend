const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: false }));
app.use(express.json());
app.use('/certificates', express.static(path.join(__dirname, '../certificates')));

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/chapters', require('./routes/chapter.routes'));
app.use('/api/tutor', require('./routes/tutor.routes'));
app.use('/api/reverse-tutor', require('./routes/reverseTutor.routes'));
app.use('/api/exercises', require('./routes/exercise.routes'));
app.use('/api/quiz', require('./routes/quiz.routes'));
app.use('/api/progress', require('./routes/progress.routes'));
app.use('/api/certificate', require('./routes/certificate.routes'));
app.use('/api/streak', require('./routes/streak.routes'));

app.use(require('./middleware/errorHandler'));

module.exports = app;
