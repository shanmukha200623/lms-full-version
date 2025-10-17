const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Material = require('../models/Material'); // make sure you have models/Material.js

// ===============================
// 🗂️ Multer File Upload Setup
// ===============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// ===============================
// 📥 POST /api/materials - upload materials
// ===============================
router.post('/', upload.array('files', 10), async (req, res) => {
  try {
    const { title, description, courseId } = req.body;

    // Save file info
    const files = req.files.map((file) => ({
      filename: file.filename,
      path: `uploads/${file.filename}`,
      mimetype: file.mimetype,
      size: file.size,
    }));

    const newMaterial = new Material({
      title,
      description,
      courseId,
      files,
    });

    await newMaterial.save();
    res.status(201).json({
      success: true,
      message: 'Material uploaded successfully',
      material: newMaterial,
    });
  } catch (err) {
    console.error('Error uploading material:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===============================
// 📤 GET /api/materials - list all materials
// ===============================
router.get('/', async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });
    res.json(materials);
  } catch (err) {
    console.error('Error fetching materials:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 📁 GET /api/materials/:id - get single material
// ===============================
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }
    res.json(material);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// 🗑️ DELETE /api/materials/:id - delete material
// ===============================
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Material.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Material not found' });
    res.json({ success: true, message: 'Material deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// ✅ Export router
// ===============================
module.exports = router;
