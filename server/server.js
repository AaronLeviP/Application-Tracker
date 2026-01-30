require('dotenv').config()

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const applicationRoutes = require('./routes/applications')

const app = express()
const  PORT  = process.env.PORT || 5000

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

app.use('/api/applications', applicationRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});