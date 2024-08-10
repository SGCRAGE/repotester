document.addEventListener('DOMContentLoaded', function() {
    const dataContainer = document.getElementById('data-container');
    const apiUrl = 'https://ws.openodds.gg/getData';
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
            return response.text().then(text => {
                throw new Error(`Network response was not ok: ${response.statusText}. Details: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Data received:', data);
        displayData(data);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        dataContainer.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    });

    function displayData(data) {
        if (Array.isArray(data) && data.length > 0) {
            const list = document.createElement('ul');
            data.forEach(item => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h2>${item.title || 'No Title'}</h2>
                    <p><strong>Group:</strong> ${item.group || 'No Group'}</p>
                    <p><strong>Description:</strong> ${item.description || 'No Description'}</p>
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
