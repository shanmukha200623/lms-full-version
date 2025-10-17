const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    files: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', materialSchema);
