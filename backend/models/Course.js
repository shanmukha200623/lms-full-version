const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: String,
  code: String,
  description: String,
  category: String,
  level: String,
  durationWeeks: Number,
  price: Number,
  maxStudents: Number,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  published: { type: Boolean, default: false },
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);
