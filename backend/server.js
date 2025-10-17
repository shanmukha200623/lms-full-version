require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const assignmentsRoutes = require('./routes/assignments');
const materialsRoutes = require('./routes/materials');
// ... other routes (users, submissions) similarly imported

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // serve uploaded files

// connect DB
connectDB(process.env.MONGO_URI).catch(err => {
  console.error('DB connect error', err);
  process.exit(1);
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/materials', materialsRoutes);

// ping
app.get('/', (req,res)=>res.send({ ok: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log('Server listening on', PORT));
