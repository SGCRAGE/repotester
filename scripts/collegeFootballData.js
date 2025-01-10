document.addEventListener('DOMContentLoaded', function() {
    const footballDataContainer = document.getElementById('football-data-container');

    // Fetch the API key from the server
    fetch('http://localhost:3000/api-key')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching API key: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const apiKey = data.apiKey;
            console.log('API Key:', apiKey); // Log the API key
            const apiUrl = `https://api.collegefootballdata.com/teams?apiKey=${apiKey}`; // Example API endpoint

            return fetch(apiUrl);
        })
        .then(async response => {
            if (!response.ok) {
                throw new Error(`Error fetching football data: ${response.statusText}`);
            }
            const footballData = await response.json();
            displayFootballData(footballData, footballDataContainer);
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
                        <th>School</th>
                        <th>Conference</th>
                        <th>Division</th>
                        <th>City</th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(team => `
                        <tr>
                            <td>${team.school}</td>
                            <td>${team.conference}</td>
                            <td>${team.division}</td>
                            <td>${team.city}</td>
                            <td>${team.state}</td>
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