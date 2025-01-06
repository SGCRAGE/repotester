document.addEventListener('DOMContentLoaded', function() {
    const oddsContainer = document.getElementById('odds-container');
    const sportsApiUrl = 'https://api.the-odds-api.com/v4/sports';
    const oddsApiUrl = 'https://api.the-odds-api.com/v4/sports/{sport_key}/odds';
    const apiKey = '43900254fc7c455464307807da745fd7'; // Your API key
    const regions = 'us'; // Regions
    const markets = 'h2h,spreads'; // Markets
    const oddsFormat = 'decimal'; // Odds format
    const dateFormat = 'iso'; // Date format

    // Fetch the list of sports
    fetch(`${sportsApiUrl}?api_key=${apiKey}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Sports response status:', response.status);
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Network response was not ok: ${response.statusText}. Details: ${text}`);
            });
        }
        return response.json();
    })
    .then(sportsData => {
        console.log('Sports data received:', sportsData);
        // Use the first sport key for fetching odds
        const sportKey = sportsData[0].key;
        fetchOdds(sportKey);
    })
    .catch(error => {
        console.error('Error fetching sports data:', error);
        oddsContainer.innerHTML = `<p>Error fetching sports data: ${error.message}</p>`;
    });

    function fetchOdds(sportKey) {
        fetch(`${oddsApiUrl.replace('{sport_key}', sportKey)}?api_key=${apiKey}&regions=${regions}&markets=${markets}&oddsFormat=${oddsFormat}&dateFormat=${dateFormat}`, {
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
        if (Array.isArray(data) && data.length > 0) {
            const list = document.createElement('ul');
            data.forEach(odd => {
                // Adjust this based on the actual structure of the returned data
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h2>${odd.team || 'No Team'}</h2>
                    <p><strong>Odds:</strong> ${odd.odds || 'No Odds'}</p>
                    <p><strong>Date:</strong> ${odd.date || 'No Date'}</p>
                    <p><strong>Type:</strong> ${odd.type || 'No Type'}</p>
                `;
                list.appendChild(listItem);
            });
            oddsContainer.appendChild(list);
        } else {
            oddsContainer.innerHTML = '<p>No odds data available.</p>';
        }
    }
});