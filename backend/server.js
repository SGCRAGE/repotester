const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(cors());

app.get('/api/nba_data', (req, res) => {
    const apiKey = 'h26558aac-5f34-47c4-b969-55f3cf937a53'; // Replace with your actual NBA API key
    const apiUrl = `https://api.nba.com/stats/teams?api_key=${apiKey}`; // Example API endpoint

    exec(`curl -X GET "${apiUrl}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error fetching NBA data: ${error.message}`);
            return res.status(500).json({ error: 'Failed to fetch NBA data' });
        }
        if (stderr) {
            console.error(`Error fetching NBA data: ${stderr}`);
            return res.status(500).json({ error: 'Failed to fetch NBA data' });
        }
        try {
            const data = JSON.parse(stdout);
            res.json(data);
        } catch (parseError) {
            console.error(`Error parsing NBA data: ${parseError.message}`);
            res.status(500).json({ error: 'Failed to parse NBA data' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
