document.addEventListener('DOMContentLoaded', function() {
    const oddsContainer = document.getElementById('odds-container');
    const oddsApiUrl = 'https://api.the-odds-api.com/v4/sports/basketball_nba/odds';
    const apiKey = '43900254fc7c455464307807da745fd7'; // Your API key
    const regions = 'us'; // Regions
    const markets = 'h2h,spreads'; // Markets
    const oddsFormat = 'decimal'; // Odds format
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
            const list = document.createElement('ul');
            data.forEach(event => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h2>${event.home_team} vs ${event.away_team}</h2>
                    <p><strong>Commence Time:</strong> ${new Date(event.commence_time).toLocaleString()}</p>
                    <p><strong>Sport:</strong> ${event.sport_title}</p>
                    <p><strong>Bookmakers:</strong></p>
                    <ul>
                        ${event.bookmakers.map(bookmaker => `
                            <li>
                                <strong>${bookmaker.title}</strong>
                                <ul>
                                    ${bookmaker.markets.map(market => `
                                        <li>
                                            <strong>${market.key.toUpperCase()}</strong>
                                            <ul>
                                                ${market.outcomes.map(outcome => `
                                                    <li>${outcome.name}: ${outcome.price}</li>
                                                `).join('')}
                                            </ul>
                                        </li>
                                    `).join('')}
                                </ul>
                            </li>
                        `).join('')}
                    </ul>
                `;
                list.appendChild(listItem);
            });
            oddsContainer.appendChild(list);
        } else {
            oddsContainer.innerHTML = '<p>No odds data available.</p>';
        }
    }

    // Fetch NBA odds directly
    fetchOdds();
});