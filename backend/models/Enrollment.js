const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  enrolledAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
