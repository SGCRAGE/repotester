document.addEventListener('DOMContentLoaded', function() {
    const dataContainer = document.getElementById('data-container');

    fetch('https://ws.openodds.gg/getData')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data); // For debugging purposes
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
                listItem.textContent = JSON.stringify(item, null, 2); // Pretty print JSON
                list.appendChild(listItem);
            });
            dataContainer.appendChild(list);
        } else {
            dataContainer.innerHTML = '<p>No data available.</p>';
        }
    }
});
