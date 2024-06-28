from flask import Flask, request
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    app.logger.info('Received Data')
    return "Data received", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
