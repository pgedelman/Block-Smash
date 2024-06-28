from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

type_options = {1: 64, 2: 60, 3: 81, 4: 81, 5: 81, 6: 81, 7: 81, 8: 100, 9: 70, 10: 60, 11: 70, 12: 72, 13: 72, 14: 90, 15: 64, 16: 64, 17: 64, 18: 64, 19: 80, 20: 80, 21: 90}

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    app.logger.info('Received Data')
    return jsonify({'output': data['options']}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
