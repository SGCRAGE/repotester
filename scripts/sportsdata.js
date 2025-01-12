import { displayOdds } from './displayOdds.js';
import { showChartModal, showGraphModal, showExpectedValuesModal } from './showModals.js';

document.addEventListener('DOMContentLoaded', function() {
    const oddsContainer = document.getElementById('odds-container');
    let mergedData = [];

    // Fetch the API key from the server
    fetch('http://localhost:3000/odds-api-key')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching API key: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const apiKey = data.apiKey;
            console.log('API Key:', apiKey); // Log the API key
            const oddsApiUrl = `https://api.the-odds-api.com/v4/sports/basketball_ncaab/odds?apiKey=${apiKey}&regions=us,eu,us2,uk&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso`;
            const scoresApiUrl = `https://api.the-odds-api.com/v4/sports/basketball_ncaab/scores/?daysFrom=1&apiKey=${apiKey}`;

            return Promise.all([fetch(oddsApiUrl), fetch(scoresApiUrl)]);
        })
        .then(async ([oddsResponse, scoresResponse]) => {
            if (!oddsResponse.ok) {
                throw new Error(`Error fetching odds data: ${oddsResponse.statusText}`);
            }
            if (!scoresResponse.ok) {
                throw new Error(`Error fetching scores data: ${scoresResponse.statusText}`);
            }
            const requestsRemaining = oddsResponse.headers.get('x-requests-remaining');
            const requestsUsed = oddsResponse.headers.get('x-requests-used');
            const requestsLast = oddsResponse.headers.get('x-requests-last');
            const oddsData = await oddsResponse.json();
            const scoresData = await scoresResponse.json();

            // Filter out invalid scores data
            const validScoresData = scoresData.filter(score => score.scores !== null);

            return { oddsData, validScoresData, requestsRemaining, requestsUsed, requestsLast };
        })
        .then(({ oddsData, validScoresData, requestsRemaining, requestsUsed, requestsLast }) => {
            console.log('Odds data received:', oddsData); // Log the received data
            console.log('Scores data received:', validScoresData); // Log the received data
            displayRequestInfo(requestsRemaining, requestsUsed, requestsLast);
            mergedData = mergeOddsAndScores(oddsData, validScoresData);
            displayOdds(mergedData, oddsContainer);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            oddsContainer.innerHTML = `<p>${error.message}</p>`;
        });

    function displayRequestInfo(requestsRemaining, requestsUsed, requestsLast) {
        const requestInfoContainer = document.createElement('div');
        requestInfoContainer.innerHTML = `
            <p>Requests Remaining: ${requestsRemaining}</p>
            <p>Requests Used: ${requestsUsed}</p>
            <p>Usage Cost of Last API Call: ${requestsLast}</p>
        `;
        oddsContainer.parentNode.insertBefore(requestInfoContainer, oddsContainer);
    }

    function mergeOddsAndScores(oddsData, scoresData) {
        return oddsData.map(event => {
            const score = scoresData.find(score => score.id === event.id);
            if (score && score.scores) {
                event.home_score = score.scores.find(s => s.name === event.home_team)?.score;
                event.away_score = score.scores.find(s => s.name === event.away_team)?.score;
            }
            return event;
        });
    }
});