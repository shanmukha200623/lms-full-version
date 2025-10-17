const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  files: [{ filename: String, path: String }],
  grade: Number,
  gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
