document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'https://crazyninjaodds.com/api/positive-ev'; // Replace with actual API endpoint if available
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Use a proxy if necessary

  fetch(proxyUrl + apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
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

  if (data && Array.isArray(data)) {
    data.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('item');
      div.innerHTML = `
        <h3>Game: ${item.game}</h3>
        <p>Odds: ${item.odds}</p>
        <p>EV%: ${item.ev_percent}</p>
        <p>Other Info: ${item.other_info}</p>
      `;
      container.appendChild(div);
    });
  } else {
    container.innerHTML = '<p>No data available</p>';
  }
}
