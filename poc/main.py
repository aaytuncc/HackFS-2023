import json
import os
import logging
logging.basicConfig(level=logging.INFO)

logging.info(f'Contents of the current directory: {os.listdir("./")}')
# Log the contents of the current directory
logging.info(f'Contents of the current directory: {os.listdir("./inputs")}')

# Check if the file exists
if not os.path.exists('./inputs/pools'):
    logging.error('File not found')
else:
    # Load the data from the file
    with open('./inputs/pools', 'r') as file:
        data = json.load(file)

    # Sort the data by the 'apy' field in descending order
    data.sort(key=lambda x: x['apy'], reverse=True)

    # Create a dictionary of 'investigated_ones' with address and name
    investigated_ones = [{x['address']: x['name']} for x in data]

    # Create the new dictionary with 'investigated_ones' and 'best_one' as the key
    result = {
        'investigated_ones': investigated_ones,
        'best_one': data[0]
    }

    # Write the new data to the file
    with open('./outputs/result.json', 'w') as file:
        json.dump(result, file, indent=4)

    logging.info('Result written to ./outputs/result.json')
