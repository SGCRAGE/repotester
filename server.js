require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // Ensure you have node-fetch installed
const app = express();
const port = 3000;

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Endpoint to serve the API key
app.get('/api-key', (req, res) => {
  res.json({ apiKey: process.env.ODDS_API_KEY });
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
