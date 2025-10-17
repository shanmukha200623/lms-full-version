const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const multer = require('multer');
const { requireAuth } = require('../middleware/auth');
const upload = multer({ dest: 'uploads/' });

// create
router.post('/:courseId', requireAuth, upload.array('files', 10), async (req,res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  if (!course.teacherId.equals(req.user._id)) return res.status(403).json({ message: 'Only teacher' });
  const fileObjs = (req.files || []).map(f=>({ filename: f.originalname, path: f.path }));
  const a = new Assignment({
    courseId: course._id,
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    maxPoints: req.body.maxPoints,
    type: req.body.type,
    allowLate: req.body.allowLate === 'true',
    attachedFiles: fileObjs
  });
  await a.save();
  res.json(a);
});

// list assignments for course
router.get('/course/:courseId', requireAuth, async (req,res) => {
  const list = await Assignment.find({ courseId: req.params.courseId });
  res.json(list);
});

module.exports = router;
