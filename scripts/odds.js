import { calculateImpliedProbability, calculateExpectedValuePercent } from './utils.js';

document.addEventListener('DOMContentLoaded', function() {
    const oddsContainer = document.getElementById('odds-container');

    // Fetch the API key from the server
    fetch('http://localhost:3000/odds-api-key')
        .then(response => response.json())
        .then(data => {
            const apiKey = data.apiKey;
            const oddsApiUrl = `https://api.the-odds-api.com/v4/sports/basketball_nba/odds?apiKey=${apiKey}&regions=us,eu,us2,uk&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso`;

            return fetch(oddsApiUrl);
        })
        .then(response => response.json())
        .then(data => {
            data.forEach(event => {
                event.bookmakers.forEach(bookmaker => {
                    bookmaker.markets.forEach(market => {
                        market.outcomes.forEach(outcome => {
                            const probability = calculateImpliedProbability(outcome.price);
                            const expectedValuePercent = calculateExpectedValuePercent(probability, outcome.price, 100); // Assuming amount bet is 100

                            const oddsElement = document.createElement('div');
                            oddsElement.className = 'odds-item';
                            oddsElement.innerHTML = `
                                <h3>${event.home_team} vs ${event.away_team}</h3>
                                <p><strong>Market:</strong> ${market.key}</p>
                                <p><strong>Outcome:</strong> ${outcome.name}</p>
                                <p><strong>Price:</strong> ${outcome.price}</p>
                                <p><strong>Expected Value Percent:</strong> ${expectedValuePercent.toFixed(2)}%</p>
                            `;
                            oddsContainer.appendChild(oddsElement);
                        });
                    });
                });
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            oddsContainer.innerHTML = `<p>${error.message}</p>`;
        });
});
