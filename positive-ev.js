document.addEventListener('DOMContentLoaded', function() {
    const dataContainer = document.getElementById('data-container');

    // URL of the API endpoint (replace with the correct endpoint)
    const apiUrl = 'https://ws.openodds.gg/getData';
    // Your API key
    const apiKey = 'a3944d813da67c5b4b07199ecdd4affa';

    fetch(apiUrl, {
        method: 'GET', // or 'POST' depending on the API
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
        if (Array.isArray(data)) {
            const list = document.createElement('ul');
            data.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = JSON.stringify(item, null, 2);
                list.appendChild(listItem);
            });
            dataContainer.appendChild(list);
        } else {
            dataContainer.innerHTML = '<p>No data available.</p>';
        }
    }
});
