// scripts/odds-comparison.js
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://api.sportsdata.io/v4/odds'; // Replace with the actual API endpoint
    const apiKey = 'a3944d813da67c5b4b07199ecdd4affa'; // Replace with your API key

    async function fetchOdds() {
        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });
            const data = await response.json();
            displayOdds(data);
        } catch (error) {
            console.error('Error fetching odds:', error);
        }
    }

    function displayOdds(data) {
        const container = document.getElementById('odds-data');
        // Example of how to handle and display the data
        // Adjust based on the actual structure of the API response
        if (data && data.odds) {
            let html = '<h3>Odds Comparison</h3><ul>';
            data.odds.forEach(odds => {
                html += `<li>Game: ${odds.game}, Odds: ${odds.odds}</li>`;
            });
            html += '</ul>';
            container.innerHTML = html;
        } else {
            container.innerHTML = '<p>No odds data available.</p>';
        }
    }

    fetchOdds();
});
