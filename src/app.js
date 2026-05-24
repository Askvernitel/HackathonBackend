const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const ALLOWED_ORIGINS = [
  process.env.CLIENT_ORIGIN,
  'capacitor://localhost',
  'http://localhost',
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);                        // mobile / curl / same-origin
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    if (/\.ngrok[-\w]*\.(app|io|dev)$/.test(origin)) return cb(null, true); // any ngrok URL
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: false,
}));
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

// ── Serve React frontend (production build) ─────────────────────────────────
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));

// SPA catch-all: send index.html for any non-API, non-certificate path
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/certificates')) return next();
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.use(require('./middleware/errorHandler'));

module.exports = app;
