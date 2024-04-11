from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import tensorflow as tf
import pandas as pd
import re
import numpy as np

app = Flask(__name__)
CORS(app)

loaded_model = load_model('final_model')

class_names = pd.read_csv('class_names.csv')
dis_name = list(class_names['Class Names'])

@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.json
    if data and 'message' in data:
        # Extract the message from the request
        message = data['message']

        preds = loaded_model.predict([message])
        confidence = np.max(preds)
        if confidence >= 0.2:
            disease = dis_name[np.argmax(preds)]
        else:
            disease = "Not enough information"

        response = {
            'disease': disease,
            'confidence': float(confidence)
        }
        # Return response
        return jsonify(response)

    return jsonify({'response': 'Invalid message'})


if __name__ == '__main__':
    app.run(debug=True)
