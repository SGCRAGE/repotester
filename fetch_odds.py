import requests
import json
import os

# Your API key
API_KEY = '43900254fc7c455464307807da745fd7'

# Parameters
SPORT = 'baseball_mlb'  # Sport key for MLB
REGIONS = 'us'
MARKETS = 'h2h,spreads'
ODDS_FORMAT = 'decimal'
DATE_FORMAT = 'iso'

# File to store cached data
CACHE_FILE_ODDS = 'cache_odds.json'

def fetch_data_from_api(url, params):
    headers = {
        'Authorization': f'Bearer {API_KEY}'
    }
    try:
        print(f'Fetching data from: {url}')  # Debugging statement
        print(f'Headers: {headers}')  # Debugging statement
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching data: {e}')
        return None

def get_cached_data(cache_file, url, params):
    if os.path.exists(cache_file):
        try:
            with open(cache_file, 'r') as cache_file_obj:
                cached_data = json.load(cache_file_obj)
                return cached_data
        except (json.JSONDecodeError, IOError) as e:
            print(f'Error reading cache file: {e}')
            return fetch_data_and_cache(cache_file, url, params)
    else:
        return fetch_data_and_cache(cache_file, url, params)

def fetch_data_and_cache(cache_file, url, params):
    data = fetch_data_from_api(url, params)
    if data is not None:
        try:
            with open(cache_file, 'w') as cache_file_obj:
                json.dump(data, cache_file_obj, indent=4)
        except IOError as e:
            print(f'Error writing cache file: {e}')
    return data

# Get a list of live & upcoming games with odds for baseball
odds_url = 'https://api.the-odds-api.com/v4/sports/baseball_mlb/odds'
odds_params = {
    'regions': 'us',
    'markets': 'h2h,spreads',
    'oddsFormat': 'decimal',
    'dateFormat': 'iso'
}

odds_data = get_cached_data(CACHE_FILE_ODDS, odds_url, odds_params)

if odds_data:
    print('Number of events:', len(odds_data))
    print(json.dumps(odds_data, indent=4))
else:
    print('Failed to fetch odds data.')
