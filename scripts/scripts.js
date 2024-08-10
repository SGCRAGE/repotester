document.addEventListener('DOMContentLoaded', function() {
    const oddsContainer = document.getElementById('odds-container');
    const apiUrl = 'https://ws.openodds.gg/getData'; // Make sure this is the correct API URL
    const apiKey = '43900254fc7c455464307807da745fd7'; // Your API key

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
