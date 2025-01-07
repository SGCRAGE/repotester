import { calculateImpliedProbability, calculateExpectedValue } from './utils.js';
import { showChartModal, showGraphModal } from './showModals.js';

export function displayOdds(data, oddsContainer, selectedRegions) {
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

                    event.bookmakers.forEach(bookmaker => {
                        console.log('Processing bookmaker:', bookmaker); // Log each bookmaker
                        if (selectedRegions.length === 0 || selectedRegions.includes(bookmaker.region)) {
                            bookmaker.markets.forEach(market => {
                                console.log('Processing market:', market); // Log each market
                                market.outcomes.forEach(outcome => {
                                    console.log('Processing outcome:', outcome); // Log each outcome
                                    if (market.key === 'h2h') {
                                        h2hOutcomes.push(outcome);
                                    } else if (market.key === 'spreads') {
                                        spreadOutcomes.push(outcome);
                                    }
                                });
                            });
                        }
                    });

                    console.log('H2H Outcomes:', h2hOutcomes); // Log H2H outcomes
                    console.log('Spread Outcomes:', spreadOutcomes); // Log Spread outcomes

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
                                                    ${event.bookmakers.filter(bookmaker => selectedRegions.length === 0 || selectedRegions.includes(bookmaker.region)).map(bookmaker => `
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
                                                                        <td>${expectedValue}%</td>
                                                                    </tr>
                                                                `;
                                                            }).join('')}
                                                        `).join('')}
                                                    `).join('')}
                                                </tbody>
                                            </table>
                                            <button class="view-chart" data-event="${event.home_team} vs ${event.away_team}" data-market="h2h">View Chart</button>
                                            <button class="view-graph" data-event="${event.home_team} vs ${event.away_team}" data-market="h2h">View Graph</button>
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
                                                    ${event.bookmakers.filter(bookmaker => selectedRegions.length === 0 || selectedRegions.includes(bookmaker.region)).map(bookmaker => `
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
                                                                        <td>${expectedValue}%</td>
                                                                    </tr>
                                                                `;
                                                            }).join('')}
                                                        `).join('')}
                                                    `).join('')}
                                                </tbody>
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
                showChartModal(eventTitle, market, data, selectedRegions);
            });
        });

        // Add event listeners for view graph buttons
        const viewGraphButtons = document.querySelectorAll('.view-graph');
        viewGraphButtons.forEach(button => {
            button.addEventListener('click', function() {
                const eventTitle = this.getAttribute('data-event');
                const market = this.getAttribute('data-market');
                showGraphModal(eventTitle, market, data, selectedRegions);
            });
        });
    } else {
        oddsContainer.innerHTML = '<p>No odds data available.</p>';
    }
}
