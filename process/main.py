import json
import pprint as pp

# Define the path to the JSON file
file_path = 'dara.json'

# Load the JSON data
with open(file_path, 'r') as file:
    data = json.load(file)
    results = data['results']
    times = []
    for result in results:
        times.append(result['t'])
    
    # print times to file
    print(times)

