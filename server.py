from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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

if __name__ == '__main__':
    app.run(port=5000, debug=True)
