import requests
import json
import os

# Your API key
API_KEY = 'a3944d813da67c5b4b07199ecdd4affa'

# Parameters
SPORT = 'upcoming'  # Replace with a valid sport key if needed
REGIONS = 'us'
MARKETS = 'h2h,spreads'
ODDS_FORMAT = 'decimal'
DATE_FORMAT = 'iso'

# File to store cached data
CACHE_FILE_SPORTS = 'cache_sports.json'
CACHE_FILE_ODDS = 'cache_odds.json'

def fetch_data_from_api(url, params):
    headers = {
        'Authorization': f'Bearer {API_KEY}'
    }
    response = requests.get(url, headers=headers, params=params)
    response.raise_for_status()  # Raises an HTTPError for bad responses
    return response.json()

def get_cached_data(cache_file, url, params):
    if os.path.exists(cache_file):
        with open(cache_file, 'r') as cache_file_obj:
            cached_data = json.load(cache_file_obj)
            return cached_data
    else:
        data = fetch_data_from_api(url, params)
        with open(cache_file, 'w') as cache_file_obj:
            json.dump(data, cache_file_obj, indent=4)
        return data

# Get a list of in-season sports
sports_url = 'https://api.the-odds-api.com/v4/sports'
sports_params = {}
sports_data = get_cached_data(CACHE_FILE_SPORTS, sports_url, sports_params)

print('List of in-season sports:', json.dumps(sports_data, indent=4))

# Get a list of live & upcoming games with odds
odds_url = f'https://api.the-odds-api.com/v4/sports/{SPORT}/odds'
odds_params = {
    'regions': REGIONS,
    'markets': MARKETS,
    'oddsFormat': ODDS_FORMAT,
    'dateFormat': DATE_FORMAT,
}
odds_data = get_cached_data(CACHE_FILE_ODDS, odds_url, odds_params)

print('Number of events:', len(odds_data))
print(json.dumps(odds_data, indent=4))
