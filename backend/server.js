const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // Ensure you have node-fetch installed
const app = express();
const port = 3000;

app.use(cors());

app.get('/api/nba_data', async (req, res) => {
    const apiKey = 'h26558aac-5f34-47c4-b969-55f3cf937a53'; // Replace with your actual NBA API key
    const apiUrl = `https://api.nba.com/stats/teams?api_key=${apiKey}`; // Example API endpoint

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error fetching NBA data: ${response.statusText}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching NBA data:', error);
        res.status(500).json({ error: 'Failed to fetch NBA data' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
