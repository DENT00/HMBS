const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Enable Global Network Middleware Configurations
app.use(express.json()); // Allows server to understand JSON strings sent from forms
app.use(cors());         // Allows frontend network requests to securely link with backend

// Serve Hardcoded Presentation Layer Assets Static Folder Maps
app.use(express.static(path.join(__dirname, '../frontend')));

// Endpoint Route Blueprint Mappings
app.use('/api/auth', require('./routes/authRoutes'));

// Note: You will uncomment these as your team builds them in Sprint 2 and 3
// app.use('/api/donors', require('./routes/donorRoutes'));
// app.use('/api/milk', require('./routes/milkRoutes'));

// Default route to load hardcoded UI entry interface if a user visits the root domain
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/login.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 System Engine initialized on: http://localhost:${PORT}`);
});