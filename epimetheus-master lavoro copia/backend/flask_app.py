import csv
from flask import Flask, flash, request, render_template, jsonify, abort
from flask_cors import CORS
from endpoints_utils import *
from forms import *
import os
import pandas as pd
from utils import (
    preprocessSpine,
    check_gender,
    predictions_hipAndKneeR,
    predictions_hipAndKneeC,
    predictions_SpineR,
    predictions_SpineC
)

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": "http://localhost:3000",
        "allow_headers": ["Content-Type"],
        "methods": ["GET", "POST", "OPTIONS"]
    }
})
path = os.getcwd()
IMG_FOLDER = os.path.join('static', 'img')
UPLOAD_FOLDER = os.path.join(path, "static")

# CREAZIONE CARTELLA static SE NON ESISTE
if not os.path.isdir(UPLOAD_FOLDER):
    os.mkdir(UPLOAD_FOLDER)

ALLOWED_EXTENSIONS = {"xlsx", "xls"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config['UPLOAD_FOLDER'] = IMG_FOLDER
app.config["ALLOWED_EXTENSIONS"] = ALLOWED_EXTENSIONS


# funzione per controllare che l'estensione del file sia accettabile
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/get_form', methods=['POST'])
def get_form():
    data = request.json
    selected_form_type = data.get('selectedFormType')

    form_structure = None
    if selected_form_type == 0:
        form_structure = hip_and_knee_form
    elif selected_form_type == 1:
        form_structure = spine_form
    else:
        # invalid form type
        return jsonify({'error': 'Invalid form type'}), 400

    # Send the form structure to the frontend
    return jsonify({'formStructure': form_structure})


@app.route('/api/submit_hip_knee', methods=['POST'])
def submit_data_hip_knee():
    try:
        data = request.json
        extract_features_hip_knee(data)
        response = jsonify({'message': 'Data submitted successfully'}), 200
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/submit_spine', methods=['POST'])
def submit_data_spine():
    try:
        data = request.json
        # Extract relevant features from the data
        features = extract_features_spine(data)
        return jsonify({'message': 'Data submitted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/validate_data_hip_knee', methods=['POST'])
def validate_data_hip_knee():
    try:
        data = request.json
        features = extract_features_hip_knee(data)
        # Perform data validation actions
        errors = check_errors_hip_knee(features)

        if not errors:
            return jsonify({'message': 'Data validation successful'}), 200
        else:
            return jsonify(errors)

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/validate_data_spine', methods=['POST'])
def validate_data_spine():
    try:
        data = request.json
        features = extract_features_spine(data)
        # Perform data validation actions
        errors = check_errors_spine(features)

        if not errors:
            return jsonify({'message': 'Data validation successful'}), 200
        else:
            return jsonify(errors)

    except Exception as e:
        return jsonify({'error': str(e)}), 400


@app.route('/api/predict_hip_knee', methods=['POST'])
def predictions_hip_knee():
    try:
        # Extract data from the request body
        data = request.get_json()

        if data is None:
            # If the request payload is not valid JSON, return an error response
            return jsonify({'error': 'Invalid JSON format'}), 400

        # Validate the data using the existing validation logic
        validation_errors = check_errors_hip_knee(data)

        if validation_errors:
            # If validation fails, return error messages
            return jsonify({'errors': validation_errors}), 422

        # Use the extracted features for predictions
        features = extract_features_hip_knee(data)
        predictions_data = make_predictions_hip_knee(features)

        # Return the predictions
        return jsonify({'predictions': predictions_data}), 200

    except Exception as e:
        # Handle any unexpected errors
        return jsonify({'error': str(e)}), 500


@app.route('/api/predict_spine', methods=['POST'])
def predictions_spine():
    try:
        # Extract data from the request body
        data = request.get_json()

        if data is None:
            # If the request payload is not valid JSON, return an error response
            return jsonify({'error': 'Invalid JSON format'}), 400

        # Validate the data using the existing validation logic
        validation_errors = check_errors_spine(data)

        if validation_errors:
            # If validation fails, return error messages
            return jsonify({'errors': validation_errors}), 422

        # Use the extracted features for predictions
        features = extract_features_spine(data)
        predictions_data = make_predictions_spine(features)

        # Return the predictions
        return jsonify({'predictions': predictions_data}), 200

    except Exception as e:
        # Handle any unexpected errors
        return jsonify({'error': str(e)}), 500

@app.route('/api/submit_modal_form', methods=['POST'])
def submit_form():
    try:
        data = request.json
        nome_file = 'dati_modal_form.csv'  # Nome del file dove salvare i dati
        salva_in_csv(data, nome_file)
        return jsonify({'message': 'Platform evaluation form ricevuto e salvato con successo!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/submit_platform_evaluation_form', methods=['POST'])
def submit_platform_evaluation_form():
    try:
        data = request.json
        nome_file = 'dati_platform_evaluation.csv'  # Nome del file dove salvare i dati
        salva_in_csv(data, nome_file)
        return jsonify({'message': 'Platform evaluation form ricevuto e salvato con successo!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def salva_in_csv(dati, nome_file):
    with open(nome_file, mode='a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        if file.tell() == 0:  # controllo se il file è vuoto e scrivo l'intestazione
            writer.writerow(dati.keys())
        writer.writerow(dati.values())
    

@app.route("/data/analysis", methods=["POST"])
def output():
    data = request.get_json()
    print("Ricevuto:", data)

    if data.get("dataSource") == "patientEpisode":
        score_type = data.get("score")
        return jsonify({"predictionC_6M": 42, "type": score_type})

    return jsonify({"error": "dataSource not recognized"}), 400


@app.route("/Configs/tasks_list", methods=["GET"])
def get_tasks():
    return jsonify(["Task 1", "Task 2", "Task 3"])

if __name__ == "__main__":
    app.run(debug=True)
