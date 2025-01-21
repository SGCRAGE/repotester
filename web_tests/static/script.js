// Function to fetch and display data
async function fetchAndDisplayData(date) {
    const isLocal = window.location.hostname === 'localhost';
    const baseUrl = isLocal ? 'http://localhost:5000' : 'https://your-remote-server.com';
    const url = `${baseUrl}/api/ttm-squeeze-stocks?date=${date}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const tableBody = document.querySelector('#stocksTable tbody');
        tableBody.innerHTML = ''; // Clear any existing data

        // Iterate through the data and create table rows
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.date}</td>
                <td>${item.ticker}</td>
                <td>${item.in_squeeze ? 'Yes' : 'No'}</td>
                <td>${item.out_of_squeeze ? 'Yes' : 'No'}</td>
                <td>${item.no_of_days_in_squeeze}</td>
                <td>${item.no_of_days_out_of_squeeze}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Add event listener to fetch button
document.getElementById('fetchButton').addEventListener('click', () => {
    const dateInput = document.getElementById('dateInput');
    const selectedDate = dateInput.value;
    fetchAndDisplayData(selectedDate);
});

// Fetch and display data on page load with default date
fetchAndDisplayData('2025-01-20');