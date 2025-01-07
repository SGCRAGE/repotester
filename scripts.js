document.addEventListener('DOMContentLoaded', function() {
    const oddsContainer = document.getElementById('odds-container');
    const oddsApiUrl = 'https://api.the-odds-api.com/v4/sports/basketball_nba/odds';
    const apiKey = '43900254fc7c455464307807da745fd7'; // Your API key
    const regions = 'us'; // Regions
    const markets = 'h2h,spreads'; // Markets
    const oddsFormat = 'american'; // Odds format
    const dateFormat = 'iso'; // Date format

    function fetchOdds() {
        fetch(`${oddsApiUrl}?api_key=${apiKey}&regions=${regions}&markets=${markets}&oddsFormat=${oddsFormat}&dateFormat=${dateFormat}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Odds response status:', response.status);
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Network response was not ok: ${response.statusText}. Details: ${text}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Odds data received:', data);
            displayOdds(data);
        })
        .catch(error => {
            console.error('Error fetching odds data:', error);
            oddsContainer.innerHTML = `<p>Error fetching odds data: ${error.message}</p>`;
        });
    }

    function displayOdds(data) {
        console.log('Displaying odds data:', data); // Log the data to inspect its structure
        if (Array.isArray(data) && data.length > 0) {
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Home Team</th>
                        <th>Away Team</th>
                        <th>Commence Time</th>
                        <th>Sport</th>
                        <th>Bookmaker</th>
                        <th>Market</th>
                        <th>Outcomes</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(event => `
                        ${event.bookmakers.map(bookmaker => `
                            ${bookmaker.markets.map(market => `
                                <tr>
                                    <td>${event.home_team}</td>
                                    <td>${event.away_team}</td>
                                    <td>${new Date(event.commence_time).toLocaleString()}</td>
                                    <td>${event.sport_title}</td>
                                    <td>${bookmaker.title}</td>
                                    <td>${market.key.toUpperCase()}</td>
                                    <td>
                                        <ul>
                                            ${market.outcomes.map(outcome => `
                                                <li>${outcome.name}: ${outcome.price}</li>
                                            `).join('')}
                                        </ul>
                                    </td>
                                </tr>
                            `).join('')}
                        `).join('')}
                    `).join('')}
                </tbody>
            `;
            oddsContainer.appendChild(table);
        } else {
            oddsContainer.innerHTML = '<p>No odds data available.</p>';
        }
    }

    // Fetch NBA odds directly
    fetchOdds();
});