const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const recordingRoutes = require('./routes/recordingRoutes');
const transcriptionRoutes = require('./routes/transcriptionRoutes');
const { errorHandler } = require('./middlewares/errorHandler');
const { requireAuth } = require('./middlewares/authMiddleware');

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// database connection
mongoose.connect('mongodb://localhost:27017/meetingapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connected to MongoDB!');
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', requireAuth, meetingRoutes);
app.use('/api/recordings', requireAuth, recordingRoutes);
app.use('/api/transcriptions', requireAuth, transcriptionRoutes);

// error handler
app.use(errorHandler);

// server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
