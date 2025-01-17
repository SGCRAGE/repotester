document.addEventListener('DOMContentLoaded', function() {
    const datePicker = document.getElementById('date-picker');
    const fetchDataButton = document.getElementById('fetch-data');
    const stocksContainer = document.getElementById('stocks-container');

    fetchDataButton.addEventListener('click', fetchStocksData);

    function fetchStocksData() {
        const selectedDate = datePicker.value;
        const apiUrl = `http://localhost:3000/api/ttm-squeeze-stocks?date=${selectedDate}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching stocks data: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                displayStocksData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                stocksContainer.innerHTML = `<p>${error.message}</p>`;
            });
    }

    function displayStocksData(data) {
        if (Array.isArray(data) && data.length > 0) {
            stocksContainer.innerHTML = ''; // Clear previous data
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Company</th>
                        <th>In Squeeze</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(stock => `
                        <tr>
                            <td>${stock.symbol}</td>
                            <td>${stock.company}</td>
                            <td>${stock.in_squeeze ? 'Yes' : 'No'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            stocksContainer.appendChild(table);
        } else {
            stocksContainer.innerHTML = '<p>No stocks data available.</p>';
        }
    }

    // Fetch data for the default date on page load
    fetchStocksData();
});
