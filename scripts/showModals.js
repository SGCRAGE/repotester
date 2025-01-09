import { calculateImpliedProbability } from './utils.js';

export function showChartModal(eventTitle, market, eventData) {
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
                    </tr>
                </thead>
                <tbody>
                    ${eventData.bookmakers.map(bookmaker => `
                        ${bookmaker.markets.filter(m => m.key === market).map(market => `
                            ${market.outcomes.map(outcome => {
                                const impliedProbability = calculateImpliedProbability(outcome.price);
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
                                    </tr>
                                `;
                            }).join('')}
                        `).join('')}
                    `).join('')}
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

export function showGraphModal(eventTitle, market, eventData) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    const homeScore = eventData.home_score !== undefined ? eventData.home_score : 'N/A';
    const awayScore = eventData.away_score !== undefined ? eventData.away_score : 'N/A';
    const totalScore = homeScore !== 'N/A' && awayScore !== 'N/A' ? Number(homeScore) + Number(awayScore) : 'N/A';

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${eventTitle} - ${market.toUpperCase()} Market</h2>
            <p>Game Score: ${eventData.home_team} ${homeScore} - ${eventData.away_team} ${awayScore}</p>
            <p>Total Game Score: ${totalScore}</p>
            <label for="bookmakerFilter">Filter by Bookmaker:</label>
            <div id="bookmakerFilter" class="dropdown">
                <button class="dropbtn">Select Bookmakers</button>
                <div class="dropdown-content">
                    <label><input type="checkbox" value="all" checked> All</label>
                    ${eventData.bookmakers.map(bookmaker => `<label><input type="checkbox" value="${bookmaker.title}"> ${bookmaker.title}</label>`).join('')}
                </div>
            </div>
            <canvas id="oddsChart" style="display: block; box-sizing: border-box; height: 400px; width: 800px; background-color: black;" width="800" height="400"></canvas>
            <table id="totalsMarketTable">
                <thead>
                    <tr>
                        <th>Bookmaker</th>
                        <th>Market</th>
                        <th>Outcome Name</th>
                        <th>Price</th>
                        <th>Point</th>
                        <th>Implied Probability</th>
                    </tr>
                </thead>
                <tbody>
                    ${eventData.bookmakers.map(bookmaker => `
                        ${bookmaker.markets.filter(m => m.key === market).map(market => `
                            ${market.outcomes.map(outcome => {
                                const impliedProbability = calculateImpliedProbability(outcome.price);
                                return `
                                    <tr>
                                        <td>${bookmaker.title}</td>
                                        <td>${market.key.toUpperCase()}</td>
                                        <td>${outcome.name}</td>
                                        <td>${outcome.price}</td>
                                        <td>${outcome.point !== undefined ? outcome.point : 'N/A'}</td>
                                        <td>${(impliedProbability * 100).toFixed(2)}%</td>
                                    </tr>
                                `;
                            }).join('')}
                        `).join('')}
                    `).join('')}
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

    // Prepare data for the chart
    const chartData = [];
    const chartLabels = [];
    const chartColors = [];
    const highestPrice = Math.max(...eventData.bookmakers.flatMap(bookmaker => bookmaker.markets.filter(m => m.key === market).flatMap(market => market.outcomes.map(o => o.price))));
    const lowestPrice = Math.max(...eventData.bookmakers.flatMap(bookmaker => bookmaker.markets.filter(m => m.key === market).flatMap(market => market.outcomes.filter(o => o.price < 0).map(o => o.price))));

    eventData.bookmakers.forEach(bookmaker => {
        bookmaker.markets.filter(m => m.key === market).forEach(market => {
            market.outcomes.forEach(outcome => {
                chartLabels.push(`${bookmaker.title} - ${outcome.name}`);
                chartData.push(outcome.price);
                chartColors.push(bookmaker.title === 'Pinnacle' ? 'rgba(128, 0, 128, 0.2)' : outcome.price === highestPrice ? 'rgba(75, 192, 192, 0.2)' : outcome.price === lowestPrice ? 'rgba(255, 99, 132, 0.2)' : 'rgba(201, 203, 207, 0.2)');
            });
        });
    });

    // Create the chart
    const ctx = document.getElementById('oddsChart').getContext('2d');
    const oddsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Odds',
                data: chartData,
                backgroundColor: chartColors,
                borderColor: chartColors.map(color => color.replace('0.2', '1')),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'white' // Set y-axis text color to white
                    }
                },
                x: {
                    ticks: {
                        color: 'white' // Set x-axis text color to white
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // Set legend text color to white
                    }
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            }
        }
    });

    // Add event listener to the checkboxes to filter the chart
    document.querySelectorAll('#bookmakerFilter input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const selectedBookmakers = Array.from(document.querySelectorAll('#bookmakerFilter input[type="checkbox"]:checked')).map(input => input.value);
            const filteredData = [];
            const filteredLabels = [];
            const filteredColors = [];

            eventData.bookmakers.forEach(bookmaker => {
                if (selectedBookmakers.includes('all') || selectedBookmakers.includes(bookmaker.title)) {
                    bookmaker.markets.filter(m => m.key === market).forEach(market => {
                        market.outcomes.forEach(outcome => {
                            filteredLabels.push(`${bookmaker.title} - ${outcome.name}`);
                            filteredData.push(outcome.price);
                            filteredColors.push(bookmaker.title === 'Pinnacle' ? 'rgba(128, 0, 128, 0.2)' : outcome.price === highestPrice ? 'rgba(75, 192, 192, 0.2)' : outcome.price === lowestPrice ? 'rgba(255, 99, 132, 0.2)' : 'rgba(201, 203, 207, 0.2)');
                        });
                    });
                }
            });

            oddsChart.data.labels = filteredLabels;
            oddsChart.data.datasets[0].data = filteredData;
            oddsChart.data.datasets[0].backgroundColor = filteredColors;
            oddsChart.data.datasets[0].borderColor = filteredColors.map(color => color.replace('0.2', '1'));
            oddsChart.update();
        });
    });
}

export function showExpectedValuesModal(eventTitle, market, eventData) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${eventTitle} - ${market.toUpperCase()} Market Expected Values</h2>
            <table>
                <thead>
                    <tr>
                        <th>Bookmaker</th>
                        <th>Market</th>
                        <th>Outcome Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${eventData.bookmakers.map(bookmaker => `
                        ${bookmaker.markets.filter(m => m.key === market).map(market => `
                            ${market.outcomes.map(outcome => {
                                const impliedProbability = calculateImpliedProbability(outcome.price);
                                return `
                                    <tr>
                                        <td>${bookmaker.title}</td>
                                        <td>${market.key.toUpperCase()}</td>
                                        <td>${outcome.name}</td>
                                        <td>${outcome.price}</td>
                                    </tr>
                                `;
                            }).join('')}
                        `).join('')}
                    `).join('')}
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
