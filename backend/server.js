const express = require('express');
const { getTeamStats } = require('nba_api'); // Example function from nba_api
const app = express();
const port = 3000;

app.get('/api/nba_data', async (req, res) => {
    try {
        const data = await getTeamStats(); // Fetch data from NBA API
        res.json(data);
    } catch (error) {
        console.error('Error fetching NBA data:', error);
        res.status(500).json({ error: 'Failed to fetch NBA data' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
