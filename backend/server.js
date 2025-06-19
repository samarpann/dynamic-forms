// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const formRoutes = require('./routes/formRoutes');



const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/forms', formRoutes);

// Connect MongoDB
mongoose.connect('mongodb+srv://samarpan:samarpan@cluster0.vfpghba.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB error:', err));

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

