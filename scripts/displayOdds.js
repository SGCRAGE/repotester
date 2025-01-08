import { calculateImpliedProbability, calculateExpectedValue } from './utils.js';
import { showChartModal, showGraphModal, showExpectedValuesModal } from './showModals.js';

export function displayOdds(data, oddsContainer) {
    console.log('Displaying odds data:', data); // Log the data to inspect its structure

    // Clear existing odds data
    oddsContainer.innerHTML = '';

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
                    console.log('Processing event:', event); // Log each event
                    const h2hOutcomes = [];
                    const spreadOutcomes = [];
                    const totalsOutcomes = [];

                    event.bookmakers.forEach(bookmaker => {
                        console.log('Processing bookmaker:', bookmaker); // Log each bookmaker
                        bookmaker.markets.forEach(market => {
                            console.log('Processing market:', market); // Log each market
                            market.outcomes.forEach(outcome => {
                                console.log('Processing outcome:', outcome); // Log each outcome
                                if (market.key === 'h2h') {
                                    h2hOutcomes.push(outcome);
                                } else if (market.key === 'spreads') {
                                    spreadOutcomes.push(outcome);
                                } else if (market.key === 'totals') {
                                    totalsOutcomes.push(outcome);
                                }
                            });
                        });
                    });

                    console.log('H2H Outcomes:', h2hOutcomes); // Log H2H outcomes
                    console.log('Spread Outcomes:', spreadOutcomes); // Log Spread outcomes
                    console.log('Totals Outcomes:', totalsOutcomes); // Log Totals outcomes

                    const highestH2H = h2hOutcomes.length > 0 ? Math.max(...h2hOutcomes.map(o => o.price)) : null;
                    const lowestH2H = h2hOutcomes.length > 0 ? Math.min(...h2hOutcomes.map(o => o.price)) : null;
                    const highestSpread = spreadOutcomes.length > 0 ? Math.max(...spreadOutcomes.map(o => o.price)) : null;
                    const lowestSpread = spreadOutcomes.length > 0 ? Math.min(...spreadOutcomes.map(o => o.price)) : null;
                    const highestTotals = totalsOutcomes.length > 0 ? Math.max(...totalsOutcomes.map(o => o.price)) : null;
                    const lowestTotals = totalsOutcomes.length > 0 ? Math.min(...totalsOutcomes.map(o => o.price)) : null;

                    return `
                        <tr class="collapsible-header">
                            <td colspan="12">
                                <button class="collapsible">${event.home_team} vs ${event.away_team} - ${new Date(event.commence_time).toLocaleString()}</button>
                                <div class="collapsible-content">
                                    <div class="market-section">
                                        <button class="collapsible">H2H Market</button>
                                        <div class="collapsible-content">
                                            <table>
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
                                                                        <td>${expectedValue}</td>
                                                                    </tr>
                                                                `;
                                                            }).join('')}
                                                        `).join('')}
                                                    `).join('')}
                                                </tbody>
                                            </table>
                                            <button class="view-chart" data-event="${event.home_team} vs ${event.away_team}" data-market="h2h" data-event-id="${event.id}">View Chart</button>
                                            <button class="view-graph" data-event="${event.home_team} vs ${event.away_team}" data-market="h2h" data-event-id="${event.id}">View Graph</button>
                                            <button class="view-expected-values" data-event="${event.home_team} vs ${event.away_team}" data-market="h2h" data-event-id="${event.id}">View Expected Values</button>
                                        </div>
                                    </div>
                                    <div class="market-section">
                                        <button class="collapsible">Spreads Market</button>
                                        <div class="collapsible-content">
                                            <table>
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
                                                                        <td>${expectedValue}</td>
                                                                    </tr>
                                                                `;
                                                            }).join('')}
                                                        `).join('')}
                                                    `).join('')}
                                                </tbody>
                                            </table>
                                            <button class="view-chart" data-event="${event.home_team} vs ${event.away_team}" data-market="spreads" data-event-id="${event.id}">View Chart</button>
                                            <button class="view-graph" data-event="${event.home_team} vs ${event.away_team}" data-market="spreads" data-event-id="${event.id}">View Graph</button>
                                            <button class="view-expected-values" data-event="${event.home_team} vs ${event.away_team}" data-market="spreads" data-event-id="${event.id}">View Expected Values</button>
                                        </div>
                                    </div>
                                    <div class="market-section">
                                        <button class="collapsible">Totals Market</button>
                                        <div class="collapsible-content">
                                            <table>
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
                                                    ${event.bookmakers.map(bookmaker => `
                                                        ${bookmaker.markets.filter(market => market.key === 'totals').map(market => `
                                                            ${market.outcomes.map(outcome => {
                                                                const impliedProbability = calculateImpliedProbability(outcome.price);
                                                                const expectedValue = calculateExpectedValue(outcome.price, impliedProbability);
                                                                const currentTime = new Date();
                                                                const commenceTime = new Date(event.commence_time);
                                                                const status = currentTime >= commenceTime ? 'Live' : 'Not Started';
                                                                const priceClass = outcome.price === highestTotals ? 'highest-price' : outcome.price === lowestTotals ? 'lowest-price' : '';
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
                                                                        <td>${expectedValue}</td>
                                                                    </tr>
                                                                `;
                                                            }).join('')}
                                                        `).join('')}
                                                    `).join('')}
                                                </tbody>
                                            </table>
                                            <button class="view-chart" data-event="${event.home_team} vs ${event.away_team}" data-market="totals" data-event-id="${event.id}">View Chart</button>
                                            <button class="view-graph" data-event="${event.home_team} vs ${event.away_team}" data-market="totals" data-event-id="${event.id}">View Graph</button>
                                            <button class="view-expected-values" data-event="${event.home_team} vs ${event.away_team}" data-market="totals" data-event-id="${event.id}">View Expected Values</button>
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
                const eventId = this.getAttribute('data-event-id');
                const market = this.getAttribute('data-market');
                const eventTitle = this.getAttribute('data-event');
                const eventData = data.find(event => event.id === eventId);
                showChartModal(eventTitle, market, eventData);
            });
        });

        // Add event listeners for view graph buttons
        const viewGraphButtons = document.querySelectorAll('.view-graph');
        viewGraphButtons.forEach(button => {
            button.addEventListener('click', function() {
                const eventId = this.getAttribute('data-event-id');
                const market = this.getAttribute('data-market');
                const eventTitle = this.getAttribute('data-event');
                const eventData = data.find(event => event.id === eventId);
                showGraphModal(eventTitle, market, eventData);
            });
        });

        // Add event listeners for view expected values buttons
        const viewExpectedValuesButtons = document.querySelectorAll('.view-expected-values');
        viewExpectedValuesButtons.forEach(button => {
            button.addEventListener('click', function() {
                const eventId = this.getAttribute('data-event-id');
                const market = this.getAttribute('data-market');
                const eventTitle = this.getAttribute('data-event');
                const eventData = data.find(event => event.id === eventId);
                showExpectedValuesModal(eventTitle, market, eventData);
            });
        });
    } else {
        oddsContainer.innerHTML = '<p>No odds data available.</p>';
    }
}
