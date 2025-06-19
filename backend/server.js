// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const formRoutes = require('./routes/formRoutes');
require('dotenv').config(); // ✅ Load environment variables from .env

const app = express();
const corsOptions = {
  origin: "https://dynamic-forms-5b87frrbi-samarpans-projects-c0e6b05a.vercel.app", // your Vercel frontend
  methods: "GET,POST,PUT,DELETE",
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

// ✅ API Routes
app.use('/api/forms', formRoutes);

// ✅ Connect to MongoDB Atlas using .env
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
