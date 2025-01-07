import { calculateImpliedProbability, calculateExpectedValue } from './utils.js';

export function showChartModal(eventTitle, market, data, selectedRegions) {
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
                            return event.bookmakers.filter(bookmaker => selectedRegions.length === 0 || selectedRegions.includes(bookmaker.region)).map(bookmaker => `
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
                                                <td>${expectedValue}%</td>
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

export function showGraphModal(eventTitle, market, data, selectedRegions) {
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
            event.bookmakers.filter(bookmaker => selectedRegions.length === 0 || selectedRegions.includes(bookmaker.region)).forEach(bookmaker => {
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
