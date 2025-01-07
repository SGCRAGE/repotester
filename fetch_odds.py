import requests
import json
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Get the API key from the environment variable
API_KEY = os.getenv('ODDS_API_KEY')

# Correct API endpoint and parameters
odds_url = 'https://api.the-odds-api.com/v4/sports/basketball_nba/odds'
odds_params = {
    'regions': 'us,eu,us2,uk',
    'markets': 'h2h,spreads',
    'oddsFormat': 'american',
    'dateFormat': 'iso'
}

def fetch_data_from_api(url, params):
    headers = {
        'Authorization': f'Bearer {API_KEY}'
    }
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json(), response.headers
    except requests.exceptions.RequestException as e:
        print(f'Error fetching data: {e}')
        return None, None

def calculate_implied_probability(price):
    return 100 / (price + 100) if price > 0 else -price / (-price + 100)

def calculate_expected_value(price, implied_probability, stake=100):
    payout = (price / 100) + 1 if price > 0 else (100 / -price) + 1
    fair_win_probability = implied_probability
    fair_loss_probability = 1 - implied_probability
    profit_if_win = payout * stake - stake
    return (fair_win_probability * profit_if_win) - (fair_loss_probability * stake)

def display_odds(data):
    if isinstance(data, list) and len(data) > 0:
        for event in data:
            print(f"{event['home_team']} vs {event['away_team']}")
            for bookmaker in event['bookmakers']:
                for market in bookmaker['markets']:
                    for outcome in market['outcomes']:
                        implied_probability = calculate_implied_probability(outcome['price'])
                        expected_value = calculate_expected_value(outcome['price'], implied_probability)
                        print(f"Bookmaker: {bookmaker['title']}, Market: {market['key']}, Outcome: {outcome['name']}, Price: {outcome['price']}, Implied Probability: {implied_probability:.2%}, Expected Value: {expected_value:.2f}")
    else:
        print('No data available.')

# Fetch data
odds_data, headers = fetch_data_from_api(odds_url, odds_params)

if odds_data:
    requests_remaining = headers.get('x-requests-remaining')
    requests_used = headers.get('x-requests-used')
    print(f'Requests Remaining: {requests_remaining}')
    print(f'Requests Used: {requests_used}')
    display_odds(odds_data)
else:
    print('Failed to fetch odds data.')
