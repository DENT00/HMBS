const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// 1. Global Middleware (The Lobby Rules)
app.use(express.json()); // Allows server to understand JSON strings sent from forms
app.use(cors());         // Allows frontend network requests to securely link with backend

// 2. Serve Static Assets (The Frontend UI)
app.use(express.static(path.join(__dirname, '../frontend')));

// 3. Endpoint Routes (The Waiters)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/pasteurization', require('./routes/pasteurizationRoutes'));
app.use('/api/donations', require('./routes/donationsRoutes'));
app.use('/api/beneficiaries', require('./routes/beneficiaryRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/dispensing', require('./routes/dispensingRoutes'));


// 4. Default Route (The Front Door)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/login.html'));
});

// 5. Start the Engine
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 System Engine initialized on: http://localhost:${PORT}`);
});