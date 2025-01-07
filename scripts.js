import { displayOdds } from './scripts/displayOdds.js';
import { showChartModal, showGraphModal } from './scripts/showModals.js';

document.addEventListener('DOMContentLoaded', function() {
    const oddsContainer = document.getElementById('odds-container');
    const filterContainer = document.getElementById('filter-container');

    // Fetch the API key from the server
    fetch('http://localhost:3000/api-key')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching API key: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const apiKey = data.apiKey;
            const apiUrl = `https://api.the-odds-api.com/v4/sports/basketball_nba/odds?api_key=${apiKey}&regions=us,eu,us2,uk&markets=h2h,spreads&oddsFormat=american&dateFormat=iso`;

            return fetch(apiUrl);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching odds data: ${response.statusText}`);
            }
            const requestsRemaining = response.headers.get('x-requests-remaining');
            const requestsUsed = response.headers.get('x-requests-used');
            return response.json().then(data => ({ data, requestsRemaining, requestsUsed }));
        })
        .then(({ data, requestsRemaining, requestsUsed }) => {
            console.log('Odds data received:', data);
            displayRequestInfo(requestsRemaining, requestsUsed);
            displayOdds(data, oddsContainer, getSelectedRegions());

            // Add event listeners to the checkboxes
            const checkboxes = document.querySelectorAll('.region-filter');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => displayOdds(data, oddsContainer, getSelectedRegions()));
            });
        })
        .catch(error => {
            console.error('Error fetching odds data:', error);
            oddsContainer.innerHTML = `<p>${error.message}</p>`;
        });

    function displayRequestInfo(requestsRemaining, requestsUsed) {
        const requestInfoContainer = document.createElement('div');
        requestInfoContainer.innerHTML = `
            <p>Requests Remaining: ${requestsRemaining}</p>
            <p>Requests Used: ${requestsUsed}</p>
        `;
        oddsContainer.parentNode.insertBefore(requestInfoContainer, oddsContainer);
    }

    function getSelectedRegions() {
        return Array.from(document.querySelectorAll('.region-filter:checked')).map(input => input.value);
    }
});