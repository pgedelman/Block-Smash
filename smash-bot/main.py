from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from time import sleep

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

type_options = {1: 64, 2: 60, 3: 81, 4: 81, 5: 81, 6: 81, 7: 81, 8: 100, 9: 70, 10: 60, 11: 70, 12: 72, 13: 72, 14: 90, 15: 64, 16: 64, 17: 64, 18: 64, 19: 80, 20: 80, 21: 90}

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    app.logger.info(f'Received Data ${data['options']}')

    options = {}
    for blockType, indexes in data['options'].items():
        options[blockType] = []
        for index in indexes:   
            options[blockType].append(int(index != [-1, -1]))

    first_option = []
    for blockType, op in options.items():  
        for j, option in enumerate(op):
            if option == 1:
                first_option = [int(blockType), j]
                break
    return jsonify(first_option), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
