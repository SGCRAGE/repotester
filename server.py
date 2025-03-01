from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import yfinance as yf
import math
from scipy.stats import norm
from datetime import datetime
import dateutil.parser
import requests_cache

# Initialize requests-cache
requests_cache.install_cache('yfinance_cache', expire_after=600)  # Cache expires after 10 minutes

app = Flask(__name__)
CORS(app)

@app.route('/api/ttm-squeeze-stocks', methods=['GET'])
def proxy():
    ticker = request.args.get('ticker')
    date = request.args.get('date', '2025-1-20')
    api_url = f'https://tradestie.com/api/v1/apps/ttm-squeeze-stocks?ticker={ticker}&date={date}'
    try:
        response = requests.get(api_url)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

def black_scholes_call_probability(S, K, T, r, sigma):
    if S <= 0 or K <= 0 or T <= 0 or sigma <= 0:
        return 0
    d2 = (math.log(S / K) + (r - 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
    return norm.cdf(d2)

def black_scholes_put_probability(S, K, T, r, sigma):
    if S <= 0 or K <= 0 or T <= 0 or sigma <= 0:
        return 0
    d2 = (math.log(S / K) + (r - 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
    return norm.cdf(-d2)

def kelly_fraction(p, b):
    if b <= 0:
        return 0
    return p - (1 - p) / b

@app.route('/api/option-analysis', methods=['GET'])
def option_analysis():
    ticker_symbol = request.args.get('ticker', '').upper()
    option_choice = request.args.get('option_type', 'b').lower()

    if not ticker_symbol:
        return jsonify({"error": "Ticker symbol is required"}), 400

    risk_free_rate = 0.01
    default_vol = 0.2

    ticker = yf.Ticker(ticker_symbol)
    expirations = ticker.options
    if not expirations:
        return jsonify({"error": f"No options data available for {ticker_symbol}"}), 400

    today = datetime.now()
    future_exps = [exp for exp in expirations if dateutil.parser.parse(exp) > today]
    if not future_exps:
        return jsonify({"error": "No future expiration dates available."}), 400

    expiration = future_exps[0]
    opt_chain = ticker.option_chain(expiration)
    exp_date = dateutil.parser.parse(expiration)
    T = (exp_date - today).total_seconds() / (365.0 * 24 * 3600)
    if T <= 0:
        return jsonify({"error": "Expiration date has passed."}), 400

    S = ticker.info.get("regularMarketPrice")
    if S is None:
        hist = ticker.history(period="1d")
        if not hist.empty:
            S = hist["Close"].iloc[-1]
        else:
            return jsonify({"error": "No market data available."}), 400

    results = []

    if option_choice in ['c', 'b']:
        calls = opt_chain.calls
        for index, row in calls.iterrows():
            strike = row["strike"]
            option_price = row["lastPrice"]
            if strike >= S or option_price <= 0:
                continue
            p = black_scholes_call_probability(S, strike, T, risk_free_rate, default_vol)
            b = (S - strike) / option_price
            kelly = kelly_fraction(p, b)
            breakeven = strike + option_price
            results.append({
                "type": "CALL",
                "strike": strike,
                "option_price": option_price,
                "breakeven": breakeven,
                "p": p,
                "b": b,
                "kelly": kelly
            })

    if option_choice in ['p', 'b']:
        puts = opt_chain.puts
        for index, row in puts.iterrows():
            strike = row["strike"]
            option_price = row["lastPrice"]
            if strike <= S or option_price <= 0:
                continue
            p = black_scholes_put_probability(S, strike, T, risk_free_rate, default_vol)
            b = (strike - S) / option_price
            kelly = kelly_fraction(p, b)
            breakeven = strike - option_price
            results.append({
                "type": "PUT",
                "strike": strike,
                "option_price": option_price,
                "breakeven": breakeven,
                "p": p,
                "b": b,
                "kelly": kelly
            })

    results_sorted = sorted(results, key=lambda x: x["kelly"], reverse=True)
    return jsonify({
        "ticker": ticker_symbol,
        "expiration": expiration,
        "underlying_price": S,
        "time_to_expiration": T,
        "results": results_sorted
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
