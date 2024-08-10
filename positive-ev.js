document.addEventListener('DOMContentLoaded', function() {
    const dataContainer = document.getElementById('data-container');

    fetch('https://ws.openodds.gg/getData')
        .then(response => response.json())
        .then(data => {
            console.log(data); // For debugging purposes
            displayData(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            dataContainer.innerHTML = '<p>Error fetching data.</p>';
        });

    function displayData(data) {
        // Process and display data here
        // For example, let's assume the data contains an array of items:
        if (Array.isArray(data)) {
            const list = document.createElement('ul');
            data.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = JSON.stringify(item); // Modify as needed based on the actual data structure
                list.appendChild(listItem);
            });
            dataContainer.appendChild(list);
        } else {
            dataContainer.innerHTML = '<p>No data available.</p>';
        }
    }
});
