import { displayOdds } from './displayOdds.js';
import { showChartModal, showGraphModal } from './showModals.js';

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
