// routes/submissions.js
const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission'); // adjust if model path differs
const { verifyToken } = require('../middleware/auth'); // middleware for authentication

// --------------------------------------------------
// 📤 POST: Submit assignment
// --------------------------------------------------
router.post('/:assignmentId', verifyToken, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { fileUrl, comments } = req.body;

    const submission = new Submission({
      assignmentId,
      studentId: req.user.id,
      fileUrl,
      comments,
      submittedAt: new Date(),
    });

    await submission.save();
    res.status(201).json({ success: true, submission });
  } catch (err) {
    console.error('Error saving submission:', err);
    res.status(500).json({ success: false, message: 'Error saving submission' });
  }
});

// --------------------------------------------------
// 📄 GET: All submissions for an assignment (teacher view)
// --------------------------------------------------
router.get('/assignment/:assignmentId', verifyToken, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const submissions = await Submission.find({ assignmentId })
      .populate('studentId', 'name email')
      .sort({ submittedAt: -1 });

    res.json({ success: true, submissions });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ success: false, message: 'Error fetching submissions' });
  }
});

// --------------------------------------------------
// 📄 GET: My submissions (student view)
// --------------------------------------------------
router.get('/my', verifyToken, async (req, res) => {
  try {
    const submissions = await Submission.find({ studentId: req.user.id })
      .populate('assignmentId', 'title dueDate')
      .sort({ submittedAt: -1 });

    res.json({ success: true, submissions });
  } catch (err) {
    console.error('Error fetching user submissions:', err);
    res.status(500).json({ success: false, message: 'Error fetching submissions' });
  }
});

// --------------------------------------------------
// 🗑️ DELETE: Remove a submission (optional)
// --------------------------------------------------
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const sub = await Submission.findById(req.params.id);
    if (!sub) return res.status(404).json({ success: false, message: 'Submission not found' });
    if (sub.studentId.toString() !== req.user.id)
      return res.status(403).json({ success: false, message: 'Not authorized' });

    await sub.remove();
    res.json({ success: true, message: 'Submission deleted' });
  } catch (err) {
    console.error('Error deleting submission:', err);
    res.status(500).json({ success: false, message: 'Error deleting submission' });
  }
});

module.exports = router;
