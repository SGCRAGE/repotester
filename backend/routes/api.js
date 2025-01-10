const express = require('express');
const router = express.Router();

router.get('/odds-api-key', (req, res) => {
  res.json({ apiKey: process.env.ODDS_API_KEY });
});

module.exports = router;
