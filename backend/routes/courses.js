const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { requireAuth } = require('../middleware/auth');

// create
router.post('/', requireAuth, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Only teachers' });
  const payload = { ...req.body, teacherId: req.user._id };
  const course = new Course(payload);
  await course.save();
  res.json(course);
});

// list / search / filter
router.get('/', requireAuth, async (req, res) => {
  const { q, category, level, status } = req.query;
  const filter = {};
  if (q) filter.title = { $regex: q, $options: 'i' };
  if (category) filter.category = category;
  if (level) filter.level = level;
  if (status === 'published') filter.published = true;
  if (status === 'draft') filter.published = false;
  const courses = await Course.find(filter).populate('teacherId','name email');
  res.json(courses);
});

// get one
router.get('/:id', requireAuth, async (req,res) => {
  const course = await Course.findById(req.params.id).populate('teacherId','name email');
  if (!course) return res.status(404).json({ message: 'Not found' });
  res.json(course);
});

// update, delete (teacher only)
router.put('/:id', requireAuth, async (req,res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Not found' });
  if (!course.teacherId.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  Object.assign(course, req.body);
  await course.save();
  res.json(course);
});

router.delete('/:id', requireAuth, async (req,res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Not found' });
  if (!course.teacherId.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
  await course.remove();
  res.json({ message: 'Deleted' });
});

module.exports = router;
