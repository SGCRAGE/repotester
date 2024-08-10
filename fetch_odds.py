import requests  # type: ignore
import json

# Your API key (replace with your actual key)
API_KEY = '43900254fc7c455464307807da745fd7'  # Replace with your actual API key

# Correct API endpoint and parameters
odds_url = 'https://api.the-odds-api.com/v4/sports/baseball_mlb/odds'
odds_params = {
    'regions': 'us',
    'markets': 'h2h,spreads',
    'oddsFormat': 'decimal'
}

def fetch_data_from_api(url, params):
    headers = {
        'Authorization': f'Bearer {API_KEY}'
    }
    try:
        print(f'Fetching data from: {url}')  # Debugging statement
        print(f'Headers: {headers}')  # Debugging statement
        print(f'Params: {params}')  # Debugging statement
        response = requests.get(url, headers=headers, params=params)
        print(f'Status Code: {response.status_code}')  # Debugging statement
        print(f'Response Text: {response.text}')  # Debugging statement
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching data: {e}')
        return None

# Fetch data
odds_data = fetch_data_from_api(odds_url, odds_params)

if odds_data:
    print('Number of events:', len(odds_data))
    print(json.dumps(odds_data, indent=4))
else:
    print('Failed to fetch odds data.')
