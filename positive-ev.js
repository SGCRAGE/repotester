document.addEventListener('DOMContentLoaded', function() {
    const oddsContainer = document.getElementById('odds-container');
    const apiUrl = 'https://api.theoddsapi.com/v4/sports/baseball/odds'; // Adjust URL to match the endpoint you need
    const apiKey = '43900254fc7c455464307807da745fd7'; // Ensure API key is correct

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Network response was not ok: ${response.statusText}. Details: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Data received:', data);
        displayOdds(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        oddsContainer.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    });

    function displayOdds(data) {
        if (Array.isArray(data) && data.length > 0) {
            oddsContainer.innerHTML = ''; // Clear previous data
            data.forEach(event => {
                const oddsItem = document.createElement('div');
                oddsItem.className = 'odds-item';
                oddsItem.innerHTML = `
                    <h3>${event.home_team} vs ${event.away_team}</h3>
                    <p><strong>Home Odds:</strong> ${event.odds.home}</p>
                    <p><strong>Away Odds:</strong> ${event.odds.away}</p>
                    <p><strong>Draw Odds:</strong> ${event.odds.draw || 'N/A'}</p>
                `;
                oddsContainer.appendChild(oddsItem);
            });
        } else {
            oddsContainer.innerHTML = '<p>No data available.</p>';
        }
    }
});
