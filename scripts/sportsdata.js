document.addEventListener('DOMContentLoaded', function() {
    const sportsDataContainer = document.getElementById('sports-data-container');
    const apiKey = 'h26558aac-5f34-47c4-b969-55f3cf937a53'; // Replace with your actual NBA API key
    const apiUrl = `https://api.nba.com/stats/teams?api_key=${apiKey}`; // Example API endpoint

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching sports data: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            displaySportsData(data, sportsDataContainer);
        })
        .catch(error => {
            console.error('Error fetching sports data:', error);
            sportsDataContainer.innerHTML = `<p>${error.message}</p>`;
        });

    function displaySportsData(data, container) {
        if (Array.isArray(data) && data.length > 0) {
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Group</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Active</th>
                        <th>Has Outrights</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(sport => `
                        <tr>
                            <td>${sport.key}</td>
                            <td>${sport.group}</td>
                            <td>${sport.title}</td>
                            <td>${sport.description}</td>
                            <td>${sport.active}</td>
                            <td>${sport.has_outrights}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            container.appendChild(table);
        } else {
            container.innerHTML = '<p>No sports data available.</p>';
        }
    }
});