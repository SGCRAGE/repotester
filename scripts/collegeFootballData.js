import { ApiClient, GamesApi } from 'cfb.js';

document.addEventListener('DOMContentLoaded', async function() {
    const footballDataContainer = document.getElementById('football-data-container');

    // Fetch the API key from the server
    const response = await fetch('http://localhost:3000/college-football-data-api-key');
    if (!response.ok) {
        console.error(`Error fetching API key: ${response.statusText}`);
        footballDataContainer.innerHTML = `<p>${response.statusText}</p>`;
        return;
    }
    const data = await response.json();
    const apiKey = data.apiKey;
    console.log('API Key:', apiKey); // Log the API key

    // Set up the cfb.js client
    const defaultClient = ApiClient.instance;
    const ApiKeyAuth = defaultClient.authentications['ApiKeyAuth'];
    ApiKeyAuth.apiKey = apiKey;
    ApiKeyAuth.apiKeyPrefix = "Bearer";

    const api = new GamesApi();
    const year = 2024;

    try {
        const games = await api.getGames(year);
        displayFootballData(games, footballDataContainer);
    } catch (error) {
        console.error('Error fetching data:', error);
        footballDataContainer.innerHTML = `<p>${error.message}</p>`;
    }

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