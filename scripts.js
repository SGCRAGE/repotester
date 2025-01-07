document.addEventListener('DOMContentLoaded', function() {
    const oddsContainer = document.getElementById('odds-container');
    const oddsApiUrl = 'https://api.the-odds-api.com/v4/sports/basketball_nba/odds';
    const apiKey = 'a3944d813da67c5b4b07199ecdd4affa'; // Your API key
    const regions = 'us'; // Regions
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
            if (!response.ok) {
                return response.text().then(text => {
                    if (response.status === 403) {
                        throw new Error('API key has expired or is invalid. Please update your API key.');
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
            oddsContainer.innerHTML = `<p>${error.message}</p>`;
        });
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
                    ${data.map(event => `
                        <tr class="collapsible-header">
                            <td colspan="12">
                                <button class="collapsible">${event.home_team} vs ${event.away_team} - ${new Date(event.commence_time).toLocaleString()}</button>
                                <div class="collapsible-content">
                                    <table>
                                        ${event.bookmakers.map(bookmaker => `
                                            ${bookmaker.markets.map(market => `
                                                ${market.outcomes.map(outcome => {
                                                    const impliedProbability = calculateImpliedProbability(outcome.price);
                                                    const expectedValue = calculateExpectedValue(outcome.price, impliedProbability);
                                                    const currentTime = new Date();
                                                    const commenceTime = new Date(event.commence_time);
                                                    const status = currentTime >= commenceTime ? 'Live' : 'Not Started';
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
                                                            <td>${outcome.price}</td>
                                                            <td>${outcome.point !== undefined ? outcome.point : 'N/A'}</td>
                                                            <td>${(impliedProbability * 100).toFixed(2)}%</td>
                                                            <td>${expectedValue.toFixed(2)}</td>
                                                        </tr>
                                                    `;
                                                }).join('')}
                                            `).join('')}
                                        `).join('')}
                                    </table>
                                    <button class="view-chart" data-event="${event.home_team} vs ${event.away_team}">View Chart</button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
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
                    showChartModal(eventTitle, data);
                });
            });
        } else {
            oddsContainer.innerHTML = '<p>No odds data available.</p>';
        }
    }

    function showChartModal(eventTitle, data) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>${eventTitle}</h2>
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
                                    ${bookmaker.markets.map(market => `
                                        ${market.outcomes.map(outcome => {
                                            const impliedProbability = calculateImpliedProbability(outcome.price);
                                            const expectedValue = calculateExpectedValue(outcome.price, impliedProbability);
                                            return `
                                                <tr>
                                                    <td>${bookmaker.title}</td>
                                                    <td>${market.key.toUpperCase()}</td>
                                                    <td>${outcome.name}</td>
                                                    <td>${outcome.price}</td>
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

    // Fetch NBA odds directly
    fetchOdds();
});