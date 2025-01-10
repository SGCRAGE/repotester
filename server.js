require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // Ensure you have node-fetch installed
const cors = require('cors'); // Ensure you have cors installed
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static('public'));

// Endpoint to serve the API key
app.get('/api-key', (req, res) => {
  const apiKey = process.env.ODDS_API_KEY;
  if (apiKey) {
    res.json({ apiKey });
  } else {
    res.status(404).json({ error: 'API key not found' });
  }
});

// Firebase configuration endpoint
app.get('/firebase-config', (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
