document.addEventListener('DOMContentLoaded', function() {
    const dataContainer = document.getElementById('data-container');

    // URL of the API endpoint (replace with the correct endpoint)
    const apiUrl = 'https://ws.openodds.gg/getData';
    // Your API key
    const apiKey = 'a3944d813da67c5b4b07199ecdd4affa';

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Data received:', data);
        displayData(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        dataContainer.innerHTML = '<p>Error fetching data.</p>';
    });

    function displayData(data) {
        if (Array.isArray(data) && data.length > 0) {
            const list = document.createElement('ul');
            data.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h2>${item.title}</h2>
                    <p><strong>Group:</strong> ${item.group}</p>
                    <p><strong>Description:</strong> ${item.description}</p>
                    <p><strong>Has Outrights:</strong> ${item.has_outrights ? 'Yes' : 'No'}</p>
                `;
                list.appendChild(listItem);
            });
            dataContainer.appendChild(list);
        } else {
            dataContainer.innerHTML = '<p>No data available.</p>';
        }
    }
});
