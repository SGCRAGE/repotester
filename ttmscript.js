// ttmscript.js

// Function to fetch and display TTM Squeeze Stocks data
async function fetchAndDisplayData() {
    const dateInput = document.getElementById('date').value;
    if (!dateInput) {
      alert('Please select a date!');
      return;
    }
    const url = `http://localhost:5000/api/ttm-squeeze-stocks?date=${dateInput}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const tableBody = document.querySelector('#stocksTable tbody');
      tableBody.innerHTML = ''; // Clear existing data
  
      if (data.error) {
        tableBody.innerHTML = `<tr><td colspan="7">Error: ${data.error}</td></tr>`;
        return;
      }
  
      // Populate table with data
      data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.date}</td>
          <td>${item.ticker}</td>
          <td>${item.in_squeeze ? 'Yes' : 'No'}</td>
          <td>${item.out_of_squeeze ? 'Yes' : 'No'}</td>
          <td>${item.no_of_days_in_squeeze}</td>
          <td>${item.no_of_days_out_of_squeeze}</td>
          <td><button class="btn btn-primary" onclick="openModal('${item.ticker}', '${item.no_of_days_in_squeeze}', '${item.no_of_days_out_of_squeeze}', '${item.in_squeeze}', '${item.out_of_squeeze}')">View Chart</button></td>
        `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Function to fetch option analysis data from the Flask endpoint
  async function fetchOptionAnalysis(ticker, optionType = 'b') {
    try {
      const response = await fetch(`http://localhost:5000/api/option-analysis?ticker=${ticker}&option_type=${optionType}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching option analysis:", error);
      return { error: "Failed to fetch option analysis." };
    }
  }
  
  // Function to open the modal and display TradingView widgets plus option analysis data
  function openModal(ticker, daysInSqueeze, daysOutOfSqueeze, inSqueeze, outSqueeze) {
    // Debug log to check that modal elements exist
    console.log("modalTicker element:", document.getElementById('modalTicker'));
  
    // Update modal content elements
    document.getElementById('modalTicker').innerText = ticker;
    document.getElementById('modalDaysInSqueeze').innerText = daysInSqueeze || 'N/A';
    document.getElementById('modalDaysOutOfSqueeze').innerText = daysOutOfSqueeze || 'N/A';
    document.getElementById('modalInSqueeze').innerText = inSqueeze === 'true' ? 'Yes' : 'No';
    document.getElementById('modalOutOfSqueeze').innerText = outSqueeze === 'true' ? 'Yes' : 'No';
  
    // Initialize TradingView Chart Widget
    const chartContainer = document.getElementById('tradingview-widget-container');
    chartContainer.innerHTML = ''; // Clear any existing widget
    new TradingView.widget({
      "container_id": "tradingview-widget-container",
      "symbol": ticker,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
      "hide_side_toolbar": false,
      "allow_symbol_change": true,
      "details": true,
      "studies": ["STD;Vortex%1Indicator"],
      "autosize": true,
    });
  
    // Initialize TradingView Fundamental Data Widget
    const fundamentalContainer = document.getElementById('fundamental-data-widget-container');
    fundamentalContainer.innerHTML = ''; // Clear existing widget
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbol": ticker,
      "width": "100%",
      "locale": "en",
      "colorTheme": "dark",
    });
    fundamentalContainer.appendChild(script);
  
    // Initialize TradingView Technical Analysis Widget
    const technicalAnalysisContainer = document.getElementById('tradingview-widget-container__widget');
    technicalAnalysisContainer.innerHTML = ''; // Clear existing widget
    const technicalScript = document.createElement('script');
    technicalScript.type = 'text/javascript';
    technicalScript.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    technicalScript.async = true;
    technicalScript.innerHTML = JSON.stringify({
      "interval": "1m",
      "width": "100%",
      "isTransparent": false,
      "height": "450",
      "symbol": ticker,
      "showIntervalTabs": true,
      "locale": "en",
      "colorTheme": "dark"
    });
    technicalAnalysisContainer.appendChild(technicalScript);
  
    // Fetch option analysis data and display it in the modal
    fetchOptionAnalysis(ticker, 'b').then(data => {
      const analysisContainer = document.getElementById('analysis-container');
      if (data.error) {
        analysisContainer.innerHTML = `<p>Error: ${data.error}</p>`;
      } else {
        let html = `<h5>Option Analysis (Expiration: ${data.expiration})</h5>`;
        html += `<p><strong>Underlying Price:</strong> ${parseFloat(data.underlying_price).toFixed(2)}</p>`;
        html += `<table class="table table-bordered">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Strike</th>
                        <th>Price</th>
                        <th>Breakeven</th>
                        <th>p</th>
                        <th>b</th>
                        <th>Kelly</th>
                      </tr>
                    </thead>
                    <tbody>`;
        data.results.forEach(res => {
          html += `<tr>
                     <td>${res.type}</td>
                     <td>${parseFloat(res.strike).toFixed(2)}</td>
                     <td>${parseFloat(res.option_price).toFixed(2)}</td>
                     <td>${parseFloat(res.breakeven).toFixed(2)}</td>
                     <td>${parseFloat(res.p).toFixed(2)}</td>
                     <td>${parseFloat(res.b).toFixed(2)}</td>
                     <td>${parseFloat(res.kelly).toFixed(2)}</td>
                   </tr>`;
        });
        html += `</tbody></table>`;
        analysisContainer.innerHTML = html;
      }
    });
  
    // Finally, show the modal
    $('#chartModal').modal('show');
  }
  
  // Automatically fetch data when the page loads
  document.addEventListener("DOMContentLoaded", () => {
    fetchAndDisplayData();
  });
  