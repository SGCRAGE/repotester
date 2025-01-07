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
                            <tr class="collapsible-header">
                                <td colspan="12">
                                    <button class="collapsible">${event.home_team} vs ${event.away_team} - ${new Date(event.commence_time).toLocaleString()}</button>
                                    <div class="collapsible-content">
                                        <div class="market-section">
                                            <button class="collapsible">H2H Market</button>
                                            <div class="collapsible-content">
                                                <table>
                                                    ${event.bookmakers.map(bookmaker => `
                                                        ${bookmaker.markets.filter(market => market.key === 'h2h').map(market => `
                                                            ${market.outcomes.map(outcome => {
                                                                const impliedProbability = calculateImpliedProbability(outcome.price);
                                                                const expectedValue = calculateExpectedValue(outcome.price, impliedProbability);
                                                                const currentTime = new Date();
                                                                const commenceTime = new Date(event.commence_time);
                                                                const status = currentTime >= commenceTime ? 'Live' : 'Not Started';
                                                                const priceClass = outcome.price === highestH2H ? 'highest-price' : outcome.price === lowestH2H ? 'lowest-price' : '';
                                                                console.log('Outcome:', outcome.name, 'Price:', outcome.price, 'Implied Probability:', impliedProbability, 'Expected Value:', expectedValue);
                                                                return `
                                                                    <tr>
                                                                        <td>${event.home_team}</td>
                                                                        <td>${event.away_team}</td>
                                                                        <td>${status}</td>
                                                                        <td>${commenceTime.toLocaleString()}</td>
                                                                        <td>${event.sport_title}</td>
                                                                        <td>${bookmaker.title}</td>
                                                                        <td>${market.key.toUpperCase()}</td>
                                                                        <td>${outcome.name}</td>
                                                                        <td class="${priceClass}">${outcome.price}</td>
                                                                        <td>${outcome.point !== undefined ? outcome.point : 'N/A'}</td>
                                                                        <td>${(impliedProbability * 100).toFixed(2)}%</td>
                                                                        <td>${expectedValue.toFixed(2)}</td>
                                                                    </tr>
                                                                `;
                                                            }).join('')}
                                                        `).join('')}
                                                    `).join('')}
                                                </table>
                                                <button class="view-chart" data-event="${event.home_team} vs ${event.away_team}" data-market="h2h">View Chart</button>
                                                <button class="view-graph" data-event="${event.home_team} vs ${event.away_team}" data-market="h2h">View Graph</button>
                                            </div>
                                        </div>
                                        <div class="market-section">
                                            <button class="collapsible">Spreads Market</button>
                                            <div class="collapsible-content">
                                                <table>
                                                    ${event.bookmakers.map(bookmaker => `
                                                        ${bookmaker.markets.filter(market => market.key === 'spreads').map(market => `
                                                            ${market.outcomes.map(outcome => {
                                                                const impliedProbability = calculateImpliedProbability(outcome.price);
                                                                const expectedValue = calculateExpectedValue(outcome.price, impliedProbability);
                                                                const currentTime = new Date();
                                                                const commenceTime = new Date(event.commence_time);
                                                                const status = currentTime >= commenceTime ? 'Live' : 'Not Started';
                                                                const priceClass = outcome.price === highestSpread ? 'highest-price' : outcome.price === lowestSpread ? 'lowest-price' : '';
                                                                console.log('Outcome:', outcome.name, 'Price:', outcome.price, 'Implied Probability:', impliedProbability, 'Expected Value:', expectedValue);
                                                                return `
                                                                    <tr>
                                                                        <td>${event.home_team}</td>
                                                                        <td>${event.away_team}</td>
                                                                        <td>${status}</td>
                                                                        <td>${commenceTime.toLocaleString()}</td>
                                                                        <td>${event.sport_title}</td>
                                                                        <td>${bookmaker.title}</td>
                                                                        <td>${market.key.toUpperCase()}</td>
                                                                        <td>${outcome.name}</td>
                                                                        <td class="${priceClass}">${outcome.price}</td>
                                                                        <td>${outcome.point !== undefined ? outcome.point : 'N/A'}</td>
                                                                        <td>${(impliedProbability * 100).toFixed(2)}%</td>
                                                                        <td>${expectedValue.toFixed(2)}</td>
                                                                    </tr>
                                                                `;
                                                            }).join('')}
                                                        `).join('')}
                                                    `).join('')}
                                                </table>
                                                <button class="view-chart" data-event="${event.home_team} vs ${event.away_team}" data-market="spreads">View Chart</button>
                                                <button class="view-graph" data-event="${event.home_team} vs ${event.away_team}" data-market="spreads">View Graph</button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            `;
            oddsContainer.appendChild(table);

            // Add event listeners for collapsible sections
            const collapsibles = document.querySelectorAll('.collapsible');
            collapsibles.forEach(collapsible => {
                collapsible.addEventListener('click', function() {
                    this.classList.toggle('active');
                    const content = this.nextElementSibling;
                    if (content.style.display === 'block') {
                        content.style.display = 'none';
                    } else {
                        content.style.display = 'block';
                    }
                });
            });

            // Add event listeners for view chart buttons
            const viewChartButtons = document.querySelectorAll('.view-chart');
            viewChartButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const eventTitle = this.getAttribute('data-event');
                    const market = this.getAttribute('data-market');
                    showChartModal(eventTitle, market, data);
                });
            });

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

    function showChartModal(eventTitle, market, data) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>${eventTitle} - ${market.toUpperCase()} Market</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Bookmaker</th>
                            <th>Market</th>
                            <th>Outcome Name</th>
                            <th>Price</th>
                            <th>Point</th>
                            <th>Implied Probability</th>
                            <th>Expected Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(event => {
                            if (`${event.home_team} vs ${event.away_team}` === eventTitle) {
                                return event.bookmakers.map(bookmaker => `
                                    ${bookmaker.markets.filter(m => m.key === market).map(market => `
                                        ${market.outcomes.map(outcome => {
                                            const impliedProbability = calculateImpliedProbability(outcome.price);
                                            const expectedValue = calculateExpectedValue(outcome.price, impliedProbability);
                                            const highestPrice = Math.max(...market.outcomes.map(o => o.price));
                                            const lowestPrice = Math.max(...market.outcomes.filter(o => o.price < 0).map(o => o.price));
                                            const priceClass = outcome.price === highestPrice ? 'highest-price' : outcome.price === lowestPrice ? 'lowest-price' : '';
                                            return `
                                                <tr>
                                                    <td>${bookmaker.title}</td>
                                                    <td>${market.key.toUpperCase()}</td>
                                                    <td>${outcome.name}</td>
                                                    <td class="${priceClass}">${outcome.price}</td>
                                                    <td>${outcome.point !== undefined ? outcome.point : 'N/A'}</td>
                                                    <td>${(impliedProbability * 100).toFixed(2)}%</td>
                                                    <td>${expectedValue.toFixed(2)}</td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    `).join('')}
                                `).join('');
                            }
                        }).join('')}
                    </tbody>
                </table>
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
                            chartData.push({
                                price: outcome.price,
                                backgroundColor: outcome.price === highestPrice ? 'rgba(75, 192, 192, 0.2)' : outcome.price === lowestPrice ? 'rgba(255, 99, 132, 0.2)' : 'rgba(201, 203, 207, 0.2)',
                                borderColor: outcome.price === highestPrice ? 'rgba(75, 192, 192, 1)' : outcome.price === lowestPrice ? 'rgba(255, 99, 132, 1)' : 'rgba(201, 203, 207, 1)'
                            });
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
                    data: chartData.map(d => d.price),
                    backgroundColor: chartData.map(d => d.backgroundColor),
                    borderColor: chartData.map(d => d.borderColor),
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