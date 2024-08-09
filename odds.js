// odds.js

document.addEventListener('DOMContentLoaded', () => {
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const apiUrl = 'http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open';

  fetch(proxyUrl + apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched data:', data); // Inspect the data
      displayData(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      document.getElementById('data-container').innerHTML = `<p>Error fetching data: ${error.message}</p>`;
    });
});

function displayData(data) {
  const container = document.getElementById('data-container');
  container.innerHTML = ''; // Clear previous data

  // Adjust this code based on the actual structure of the data
  if (Array.isArray(data)) {
    data.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('item');

      // Example of displaying data; adjust based on actual data structure
      div.innerHTML = `
        <h3>${item.title || 'No Title'}</h3>
        <p>${item.description || 'No Description'}</p>
      `;

      container.appendChild(div);
    });
  } else {
    container.innerHTML = '<p>No data available</p>';
  }
}
