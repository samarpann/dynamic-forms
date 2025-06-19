const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const formRoutes = require('./routes/formRoutes');
require('dotenv').config(); // ✅ Load environment variables from .env

const app = express();

// ✅ Allow frontend origin
app.use(cors({
  origin: 'https://dynamic-forms-git-main-samarpans-projects-c0e6b05a.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// ✅ Enable preflight requests (important!)
app.options('*', cors());

app.use(express.json());

// ✅ API Routes
app.use('/api/forms', formRoutes);

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
