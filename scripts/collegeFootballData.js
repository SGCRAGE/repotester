document.addEventListener('DOMContentLoaded', function() {
    const footballDataContainer = document.getElementById('football-data-container');

    // Fetch the API key from the server
    fetch('http://localhost:3000/college-football-data-api-key')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching API key: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const apiKey = data.apiKey;
            console.log('API Key:', apiKey); // Log the API key
            const gamesEndpoint = `https://api.collegefootballdata.com/games?year=2024&seasonType=regular&apiKey=${apiKey}`;
            const gameBoxAdvancedEndpoint = `https://api.collegefootballdata.com/game/box/advanced?apiKey=${apiKey}`;

            // Fetch the football data from the API
            fetch(gamesEndpoint)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error fetching football data: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    displayFootballData(data, footballDataContainer);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                    footballDataContainer.innerHTML = `<p>${error.message}</p>`;
                });

            fetch(gamesEndpoint, {
              headers: {
                "Authorization": `Bearer ${apiKey}`
              }
            })
            .then(response => response.json())
            .then(data => {
              const gamesList = document.getElementById("games-list");
              data.forEach(game => {
                const gameListItem = document.createElement("li");
                gameListItem.textContent = `${game.home_team} vs. ${game.away_team}`;
                gamesList.appendChild(gameListItem);
              });
            })
            .catch(error => console.error("Error:", error));

            // Make a separate API request for each game's box score advanced stats
            fetch(gameBoxAdvancedEndpoint, {
              headers: {
                "Authorization": `Bearer ${apiKey}`
              }
            })
            .then(response => response.json())
            .then(data => {
              // Process the box score advanced stats data
              console.log(data);
            })
            .catch(error => console.error("Error:", error));
        })
        .catch(error => {
            console.error('Error fetching API key:', error);
            footballDataContainer.innerHTML = `<p>${error.message}</p>`;
        });

    function displayFootballData(data, container) {
        if (Array.isArray(data) && data.length > 0) {
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Home Team</th>
                        <th>Away Team</th>
                        <th>Start Date</th>
                        <th>Start Time TBD</th>
                        <th>Completed</th>
                        <th>Neutral Site</th>
                        <th>Conference Game</th>
                        <th>Home Points</th>
                        <th>Away Points</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(game => `
                        <tr>
                            <td>${game.home_team}</td>
                            <td>${game.away_team}</td>
                            <td>${game.start_date}</td>
                            <td>${game.start_time_tbd}</td>
                            <td>${game.completed}</td>
                            <td>${game.neutral_site}</td>
                            <td>${game.conference_game}</td>
                            <td>${game.home_points}</td>
                            <td>${game.away_points}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            container.appendChild(table);
        } else {
            container.innerHTML = '<p>No football data available.</p>';
        }
    }
});