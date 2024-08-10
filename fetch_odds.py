import requests

# Your API key
API_KEY = 'a3944d813da67c5b4b07199ecdd4affa'

# Parameters
SPORT = 'upcoming'  # Replace with a valid sport key if needed
REGIONS = 'us'
MARKETS = 'h2h,spreads'
ODDS_FORMAT = 'decimal'
DATE_FORMAT = 'iso'

# Get a list of in-season sports
sports_response = requests.get(
    'https://api.the-odds-api.com/v4/sports',
    params={'api_key': API_KEY}
)

if sports_response.status_code != 200:
    print(f'Failed to get sports: status_code {sports_response.status_code}, response body {sports_response.text}')
else:
    print('List of in-season sports:', sports_response.json())

# Get a list of live & upcoming games with odds
odds_response = requests.get(
    f'https://api.the-odds-api.com/v4/sports/{SPORT}/odds',
    params={
        'api_key': API_KEY,
        'regions': REGIONS,
        'markets': MARKETS,
        'oddsFormat': ODDS_FORMAT,
        'dateFormat': DATE_FORMAT,
    }
)

if odds_response.status_code != 200:
    print(f'Failed to get odds: status_code {odds_response.status_code}, response body {odds_response.text}')
else:
    odds_json = odds_response.json()
    print('Number of events:', len(odds_json))
    print(odds_json)
    print('Remaining requests:', odds_response.headers.get('x-requests-remaining'))
    print('Used requests:', odds_response.headers.get('x-requests-used'))
