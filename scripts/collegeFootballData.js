document.addEventListener('DOMContentLoaded', function() {
    const footballDataContainer = document.getElementById('football-data-container');

    // Fetch the football data from the server
    fetch('http://localhost:3000/college-football-data')
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