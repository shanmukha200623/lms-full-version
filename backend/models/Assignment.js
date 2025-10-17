const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: String,
  description: String,
  dueDate: Date,
  maxPoints: Number,
  type: String,
  allowLate: { type: Boolean, default: false },
  attachedFiles: [{ filename: String, path: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
