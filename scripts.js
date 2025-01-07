document.addEventListener('DOMContentLoaded', function() {
    const oddsContainer = document.getElementById('odds-container');
    const oddsApiUrl = 'https://api.the-odds-api.com/v4/sports/basketball_nba/odds';
    const apiKey = '486a8c225e84ab2b246c4b1b310eea22'; // Your API key
    const regions = 'us,eu,us2,uk'; // Regions (add 'eu' to include European sportsbooks)
    const markets = 'h2h,spreads'; // Markets
    const oddsFormat = 'american'; // Odds format
    const dateFormat = 'iso'; // Date format

    function fetchOdds() {
        fetch(`${oddsApiUrl}?api_key=${apiKey}&regions=${regions}&markets=${markets}&oddsFormat=${oddsFormat}&dateFormat=${dateFormat}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log('Odds response status:', response.status);
            const requestsRemaining = response.headers.get('x-requests-remaining');
            const requestsUsed = response.headers.get('x-requests-used');
            displayRequestInfo(requestsRemaining, requestsUsed);

            if (!response.ok) {
                return response.text().then(text => {
                    const errorData = JSON.parse(text);
                    if (response.status === 401 && errorData.error_code === 'OUT_OF_USAGE_CREDITS') {
                        throw new Error('fix me');
                    } else {
                        throw new Error(`Network response was not ok: ${response.statusText}. Details: ${text}`);
                    }
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Odds data received:', data);
            displayOdds(data);
        })
        .catch(error => {
            console.error('Error fetching odds data:', error);
            if (error.message === 'fix me') {
                oddsContainer.style.display = 'none';
            } else {
                oddsContainer.innerHTML = `<p>${error.message}</p>`;
            }
        });
    }

    function displayRequestInfo(requestsRemaining, requestsUsed) {
        const requestInfoContainer = document.createElement('div');
        requestInfoContainer.innerHTML = `
            <p>Requests Remaining: ${requestsRemaining}</p>
            <p>Requests Used: ${requestsUsed}</p>
        `;
        oddsContainer.parentNode.insertBefore(requestInfoContainer, oddsContainer);
    }

    function calculateImpliedProbability(price) {
        return price > 0 ? 100 / (price + 100) : -price / (-price + 100);
    }

    function calculateExpectedValue(price, impliedProbability, stake = 100) {
        const payout = price > 0 ? (price / 100) + 1 : (100 / -price) + 1;
        const fairWinProbability = impliedProbability;
        const fairLossProbability = 1 - impliedProbability;
        const profitIfWin = payout * stake - stake;
        return (fairWinProbability * profitIfWin) - (fairLossProbability * stake);
    }

    function displayOdds(data) {
        console.log('Displaying odds data:', data); // Log the data to inspect its structure
        if (Array.isArray(data) && data.length > 0) {
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Home Team</th>
                        <th>Away Team</th>
                        <th>Status</th>
                        <th>Commence Time</th>
                        <th>Sport</th>
                        <th>Bookmaker</th>
                        <th>Market</th>
                        <th>Outcome Name</th>
                        <th>Price</th>
                        <th>Point</th>
                        <th>Implied Probability</th>
                        <th>Expected Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(event => {
                        const h2hOutcomes = [];
                        const spreadOutcomes = [];

                        event.bookmakers.forEach(bookmaker => {
                            bookmaker.markets.forEach(market => {
                                market.outcomes.forEach(outcome => {
                                    if (market.key === 'h2h') {
                                        h2hOutcomes.push(outcome);
                                    } else if (market.key === 'spreads') {
                                        spreadOutcomes.push(outcome);
                                    }
                                });
                            });
                        });

                        const highestH2H = Math.max(...h2hOutcomes.map(o => o.price));
                        const lowestH2H = Math.max(...h2hOutcomes.filter(o => o.price < 0).map(o => o.price));
                        const highestSpread = Math.max(...spreadOutcomes.map(o => o.price));
                        const lowestSpread = Math.max(...spreadOutcomes.filter(o => o.price < 0).map(o => o.price));

                        return `
                            <tr>
                                <td>${event.home_team}</td>
                                <td>${event.away_team}</td>
                                <td>${new Date(event.commence_time).toLocaleString()}</td>
                                <td>${event.sport_title}</td>
                                <td>${event.bookmakers.map(bookmaker => bookmaker.title).join(', ')}</td>
                                <td>${event.bookmakers.map(bookmaker => bookmaker.markets.map(market => market.key.toUpperCase()).join(', ')).join(', ')}</td>
                                <td>${event.bookmakers.map(bookmaker => bookmaker.markets.map(market => market.outcomes.map(outcome => outcome.name).join(', ')).join(', ')).join(', ')}</td>
                                <td>${event.bookmakers.map(bookmaker => bookmaker.markets.map(market => market.outcomes.map(outcome => outcome.price).join(', ')).join(', ')).join(', ')}</td>
                                <td>${event.bookmakers.map(bookmaker => bookmaker.markets.map(market => market.outcomes.map(outcome => outcome.point !== undefined ? outcome.point : 'N/A').join(', ')).join(', '))}</td>
                                <td>${event.bookmakers.map(bookmaker => bookmaker.markets.map(market => market.outcomes.map(outcome => (calculateImpliedProbability(outcome.price) * 100).toFixed(2) + '%').join(', ')).join(', ')).join(', ')}</td>
                                <td>${event.bookmakers.map(bookmaker => bookmaker.markets.map(market => market.outcomes.map(outcome => calculateExpectedValue(outcome.price, calculateImpliedProbability(outcome.price)).toFixed(2)).join(', ')).join(', '))}</td>
                                <td><button class="view-graph" data-event="${event.home_team} vs ${event.away_team}" data-market="h2h">View Graph</button></td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            `;
            oddsContainer.appendChild(table);

            // Add event listeners for view graph buttons
            const viewGraphButtons = document.querySelectorAll('.view-graph');
            viewGraphButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const eventTitle = this.getAttribute('data-event');
                    const market = this.getAttribute('data-market');
                    showGraphModal(eventTitle, market, data);
                });
            });
        } else {
            oddsContainer.innerHTML = '<p>No odds data available.</p>';
        }
    }

    function showGraphModal(eventTitle, market, data) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>${eventTitle} - ${market.toUpperCase()} Market</h2>
                <canvas id="oddsChart"></canvas>
            </div>
        `;
        document.body.appendChild(modal);

        // Show the modal
        modal.style.display = 'block';

        // Close the modal when the close button is clicked
        modal.querySelector('.close').addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.removeChild(modal);
        });

        // Close the modal when clicking outside of the modal content
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.removeChild(modal);
            }
        });

        // Prepare data for the chart
        const chartData = [];
        const chartLabels = [];
        const highestPrice = Math.max(...data.flatMap(event => event.bookmakers.flatMap(bookmaker => bookmaker.markets.filter(m => m.key === market).flatMap(market => market.outcomes.map(o => o.price)))));
        const lowestPrice = Math.max(...data.flatMap(event => event.bookmakers.flatMap(bookmaker => bookmaker.markets.filter(m => m.key === market).flatMap(market => market.outcomes.filter(o => o.price < 0).map(o => o.price)))));

        data.forEach(event => {
            if (`${event.home_team} vs ${event.away_team}` === eventTitle) {
                event.bookmakers.forEach(bookmaker => {
                    bookmaker.markets.filter(m => m.key === market).forEach(market => {
                        market.outcomes.forEach(outcome => {
                            chartLabels.push(`${bookmaker.title} - ${outcome.name}`);
                            chartData.push(outcome.price);
                        });
                    });
                });
            }
        });

        // Create the chart
        const ctx = document.getElementById('oddsChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: [{
                    label: 'Odds',
                    data: chartData,
                    backgroundColor: chartData.map(price => price === highestPrice ? 'rgba(75, 192, 192, 0.2)' : price === lowestPrice ? 'rgba(255, 99, 132, 0.2)' : 'rgba(201, 203, 207, 0.2)'),
                    borderColor: chartData.map(price => price === highestPrice ? 'rgba(75, 192, 192, 1)' : price === lowestPrice ? 'rgba(255, 99, 132, 1)' : 'rgba(201, 203, 207, 1)'),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Fetch NBA odds directly
    fetchOdds();
});