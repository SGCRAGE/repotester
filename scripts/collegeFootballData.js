document.addEventListener('DOMContentLoaded', function() {
    const footballDataContainer = document.getElementById('football-data-container');

    // Fetch the football data from the server
    fetch('/proxy/college-football-data')
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