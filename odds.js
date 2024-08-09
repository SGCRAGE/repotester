document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open&Args=ev_p,fb_p,fo_o,kelly,dm';
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Use this only for development

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
  if (data) {
    const div = document.createElement('div');
    div.classList.add('item');

    // Example of displaying data; adjust based on actual data structure
    div.innerHTML = `
      <h3>EV%: ${data.ev_p || 'No Data'}</h3>
      <p>Free Bet %: ${data.fb_p || 'No Data'}</p>
      <p>Final Odds (American Odds): ${data.fo_o || 'No Data'}</p>
      <p>Kelly Units: ${data.kelly || 'No Data'}</p>
      <p>Devig Method(s): ${data.dm || 'No Data'}</p>
    `;

    container.appendChild(div);
  } else {
    container.innerHTML = '<p>No data available</p>';
  }
}
