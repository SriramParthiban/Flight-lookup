from flask import Flask, render_template, request, jsonify
from datetime import datetime, timedelta
import random

app = Flask(__name__)

# Mock Data Generator
def get_mock_flights(flight_numbers):
    # Deterministic "random" based on flight number for consistent demo
    seed = sum(ord(c) for c in flight_number)
    random.seed(seed)
    
    locations = ['SFO', 'JFK', 'LHR', 'HND', 'DXB', 'CDG', 'SIN', 'SYD', 'LAX', 'MIA']
    
    start_loc = random.choice(locations)
    end_loc = random.choice([l for l in locations if l != start_loc])
    
    now = datetime.now()
    start_time = now + timedelta(hours=random.randint(2, 48))
    duration_hours = random.randint(2, 14)
    end_time = start_time + timedelta(hours=duration_hours)
    
    # Mock Timezones (simplified)
    tz_map = {
        'SFO': 'PST', 'LAX': 'PST', 'JFK': 'EST', 'MIA': 'EST',
        'LHR': 'GMT', 'CDG': 'CET', 'DXB': 'GST', 'HND': 'JST',
        'SIN': 'SGT', 'SYD': 'AEDT'
    }
    
    return [{
        'flightNumber': flight_number.upper(),
        'startLocation': start_loc,
        'endLocation': end_loc,
        'startTime': start_time.strftime('%I:%M %p, %b %d'),
        'endTime': end_time.strftime('%I:%M %p, %b %d'),
        'timeZoneStart': tz_map.get(start_loc, 'UTC'),
        'timeZoneEnd': tz_map.get(end_loc, 'UTC'),
        'status': random.choice(['On Time', 'Delayed', 'Boarding', 'Scheduled']),
        'duration': f"{duration_hours}h 00m"
    }]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/flights')
def search_flights():
    flight_number = request.args.get('flightNumber', '').strip()
    if not flight_number:
        return jsonify([])
    
    if len(flight_number) < 2:
        return jsonify([])
        
    results = get_mock_flights(flight_number)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

