document.addEventListener('DOMContentLoaded', function() {
    const oddsContainer = document.getElementById('odds-container');
    const oddsApiUrl = 'https://api.the-odds-api.com/v4/sports/basketball_nba/odds';
    let apiKey = '';
    const regions = 'us,eu,us2,uk'; // Regions (add 'eu' to include European sportsbooks)
    const markets = 'h2h,spreads'; // Markets
    const oddsFormat = 'american'; // Odds format
    const dateFormat = 'iso'; // Date format

    // Fetch the API key from the server
    fetch('http://localhost:3000/api-key')
        .then(response => response.json())
        .then(data => {
            apiKey = data.apiKey;
            console.log('Fetched API key:', apiKey); // Log the fetched API key
            if (!apiKey) {
                throw new Error('API key is missing');
            }
            fetchOdds();
        })
        .catch(error => {
            console.error('Error fetching API key:', error);
            oddsContainer.innerHTML = `<p>Error fetching API key: ${error.message}</p>`;
        });

    function fetchOdds() {
        fetch(`${oddsApiUrl}?api_key=${apiKey}&regions=${regions}&markets=${markets}&oddsFormat=${oddsFormat}&dateFormat=${dateFormat}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Odds response status:', response.status);
            const requestsRemaining = response.headers.get('x-requests-remaining');
            const requestsUsed = response.headers.get('x-requests-used');
            displayRequestInfo(requestsRemaining, requestsUsed);

            if (!response.ok) {
                return response.text().then(text => {
                    const errorData = JSON.parse(text);
                    if (response.status === 401 && errorData.error_code === 'MISSING_KEY') {
                        throw new Error('API key is missing');
                    } else {
                        throw new Error(`Network response was not ok: ${response.statusText}. Details: ${text}`);
                    }
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
            if (error.message === 'API key is missing') {
                oddsContainer.style.display = 'none';
            } else {
                oddsContainer.innerHTML = `<p>${error.message}</p>`;
            }
        });
    }

    function displayRequestInfo(requestsRemaining, requestsUsed) {
        const requestInfoContainer = document.createElement('div');
        requestInfoContainer.innerHTML = `
            <p>Requests Remaining: ${requestsRemaining}</p>
            <p>Requests Used: ${requestsUsed}</p>
        `;
        oddsContainer.parentNode.insertBefore(requestInfoContainer, oddsContainer);
    }

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

    // Fetch NBA odds directly
    fetchOdds();
});