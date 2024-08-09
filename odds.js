// odds.js

// Fetch data from the API and display it
fetch('http://api.crazyninjaodds.com/api/devigger/v1/sportsbook_devigger.aspx?api=open')
  .then(response => response.json()) // Parse JSON data
  .then(data => {
    console.log(data); // For debugging
    displayData(data); // Call function to display data
  })
  .catch(error => {
    console.error('Error fetching data:', error); // Handle errors
  });

// Function to display data
function displayData(data) {
  const container = document.getElementById('data-container'); // Container element
  container.innerHTML = ''; // Clear previous data

  data.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('item');

    // Example of displaying data
    div.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    `;

    container.appendChild(div);
  });
}
