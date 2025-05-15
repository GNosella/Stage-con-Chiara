from flask import jsonify

from utils import *


def extract_features_hip_knee(data):
    features = {
        "sesso": data.get("sesso"),
        "anni_ricovero": data.get("anni_ricovero"),
        "classe_asa": data.get("classe_asa"),
        "VAS_Total_PreOp": data.get("VAS_Total_PreOp"),
        "SF12_PhysicalScore_PreOp": data.get("physicalScore"),
        "SF12_MentalScore_PreOp": data.get("mentalScore"),
        "BMI_altezza_PreOp": data.get("bmi_altezza_preOp"),
        "BMI_peso_PreOp": data.get("bmi_peso_preOp"),
        "SF12_autovalsalute_risp_0": data.get("SF12_autovalsalute_risp_0"),
        "SF12_scale_risp_0": data.get("SF12_scale_risp_0"),
        "SF12_ultimomeseresa_risp_0": data.get("SF12_ultimomeseresa_risp_0"),
        "SF12_ultimomeselimite_risp_0": data.get("SF12_ultimomeselimite_risp_0"),
        "SF12_ultimomeseemo_risp_0": data.get("SF12_ultimomeseemo_risp_0"),
        "SF12_ultimomeseostacolo_risp_0": data.get("SF12_ultimomeseostacolo_risp_0"),
        "SF12_ultimomesesereno_risp_0": data.get("SF12_ultimomesesereno_risp_0"),
        "SF12_ultimomeseenergia_risp_0": data.get("SF12_ultimomeseenergia_risp_0"),
        "SF12_ultimomesetriste_risp_0": data.get("SF12_ultimomesetriste_risp_0"),
        "SF12_ultimomesesociale_risp_0": data.get("SF12_ultimomesesociale_risp_0"),
        "zona_operazione": data.get("zona_operazione"),
    }
    return features


def check_errors_hip_knee(data):
    errors = []

    def validate_numeric_range(value, min_value, max_value, field_name):
        if value is not None and not (min_value <= value <= max_value):
            errors.append(f'Invalid {field_name} value')

    # Validate each feature
    validate_numeric_range(data.get("sesso"), 0, 1, "sesso")
    validate_numeric_range(data.get("anni_ricovero"), 0, 120, "anni_ricovero")
    validate_numeric_range(data.get("classe_asa"), 0, 4, "classe_asa")
    validate_numeric_range(data.get("VAS_Total_PreOp"), 0, 10, "VAS_Total_PreOp")
    validate_numeric_range(data.get("SF12_PhysicalScore_PreOp"), 0, 100, "physicalScore")
    validate_numeric_range(data.get("SF12_MentalScore_PreOp"), 0, 100, "mentalScore")
    validate_numeric_range(data.get("BMI_altezza_PreOp"), 60, 250, "BMI_altezza_PreOp")
    validate_numeric_range(data.get("BMI_peso_PreOp"), 10, 500, "BMI_peso_PreOp")
    validate_numeric_range(data.get("SF12_autovalsalute_risp_0"), 0, 4, "SF12_autovalsalute_risp_0")
    validate_numeric_range(data.get("SF12_scale_risp_0"), 0, 10, "SF12_scale_risp_0")
    validate_numeric_range(data.get("SF12_ultimomeseresa_risp_0"), 0, 1, "SF12_ultimomeseresa_risp_0")
    validate_numeric_range(data.get("SF12_ultimomeselimite_risp_0"), 0, 1, "SF12_ultimomeselimite_risp_0")
    validate_numeric_range(data.get("SF12_ultimomeseemo_risp_0"), 0, 1, "SF12_ultimomeseemo_risp_0")
    validate_numeric_range(data.get("SF12_ultimomeseostacolo_risp_0"), 0, 4, "SF12_ultimomeseostacolo_risp_0")
    validate_numeric_range(data.get("SF12_ultimomesesereno_risp_0"), 0, 5, "SF12_ultimomesesereno_risp_0")
    validate_numeric_range(data.get("SF12_ultimomeseenergia_risp_0"), 0, 5, "SF12_ultimomeseenergia_risp_0")
    validate_numeric_range(data.get("SF12_ultimomesetriste_risp_0"), 0, 5, "SF12_ultimomesetriste_risp_0")
    validate_numeric_range(data.get("SF12_ultimomesesociale_risp_0"), 0, 4, "SF12_ultimomesesociale_risp_0")
    validate_numeric_range(data.get("zona_operazione"), 0, 2, "zona_operazione")

    return errors


def extract_features_spine(data):
    features = {
        "nome_operazione": data.get("nome_operazione"),
        "sesso": data.get("sesso"),
        "anni ricovero": data.get("anni_ricovero"),
        "ODI_Total_PreOp": data.get("ODI_Total_PreOp"),
        "Vas_Back_PreOp": data.get("Vas_Back_PreOp"),
        "Vas_Leg_PreOp": data.get("Vas_Leg_PreOp"),
        "SF36_GeneralHealth_PreOp": data.get("SF36_GeneralHealth_PreOp"),
        "SF36_PhysicalFunctioning_PreOp": data.get("SF36_PhysicalFunctioning_PreOp"),
        "SF36_RoleLimitPhysical_PreOp": data.get("SF36_RoleLimitPhysical_PreOp"),
        "SF36_RoleLimitEmotional_PreOp": data.get("SF36_RoleLimitEmotional_PreOp"),
        "SF36_SocialFunctioning_PreOp": data.get("SF36_SocialFunctioning_PreOp"),
        "SF36_Pain_PreOp": data.get("SF36_Pain_PreOp"),
        "SF36energyfatiguepreop": data.get("SF36_EnergyFatigue_PreOp"),
        "SF36_EmotionalWellBeing_PreOp": data.get("SF36_EmotionalWellBeing_PreOp"),
        "SF36_MentalScore_PreOp": data.get("SF36_MentalScore_PreOp"),
        "SF36_PhysicalScore_PreOp": data.get("SF36_PhysicalScore_PreOp"),
        "fabqworkpreop": data.get("FABQ_Work_PreOp"),
        "classe_asa_1": data.get("classe_asa_1"),
        "MORBIDITY": data.get("MORBIDITY"),
    }
    return features


def check_errors_spine(data):
    errors = []

    def validate_numeric_range(value, min_value, max_value, field_name):
        if value is not None and not (min_value <= value <= max_value):
            errors.append(f'Invalid {field_name} value')

    # Validate each feature
    validate_numeric_range(data.get("nome_operazione"), 0, 2, "nome_operazione")
    validate_numeric_range(data.get("sesso"), 0, 1, "sesso")
    validate_numeric_range(data.get("anni_ricovero"), 0, 120, "anni_ricovero")
    validate_numeric_range(data.get("ODI_Total_PreOp"), 0, 100, "ODI_Total_PreOp")
    validate_numeric_range(data.get("Vas_Back_PreOp"), 0, 10, "Vas_Back_PreOp")
    validate_numeric_range(data.get("Vas_Leg_PreOp"), 0, 10, "Vas_Leg_PreOp")
    validate_numeric_range(data.get("SF36_GeneralHealth_PreOp"), 0, 100, "SF36_GeneralHealth_PreOp")
    validate_numeric_range(data.get("SF36_PhysicalFunctioning_PreOp"), 0, 100, "SF36_PhysicalFunctioning_PreOp")
    validate_numeric_range(data.get("SF36_RoleLimitPhysical_PreOp"), 0, 100, "SF36_RoleLimitPhysical_PreOp")
    validate_numeric_range(data.get("SF36_RoleLimitEmotional_PreOp"), 0, 100, "SF36_RoleLimitEmotional_PreOp")
    validate_numeric_range(data.get("SF36_SocialFunctioning_PreOp"), 0, 100, "SF36_SocialFunctioning_PreOp")
    validate_numeric_range(data.get("SF36_Pain_PreOp"), 0, 100, "SF36_Pain_PreOp")
    validate_numeric_range(data.get("SF36_EnergyFatigue_PreOp"), 0, 100, "SF36_EnergyFatigue_PreOp")
    validate_numeric_range(data.get("SF36_EmotionalWellBeing_PreOp"), 0, 100, "SF36_EmotionalWellBeing_PreOp")
    validate_numeric_range(data.get("SF36_MentalScore_PreOp"), 0, 100, "SF36_MentalScore_PreOp")
    validate_numeric_range(data.get("SF36_PhysicalScore_PreOp"), 0, 100, "SF36_PhysicalScore_PreOp")
    validate_numeric_range(data.get("FABQ_Work_PreOp"), 0, 66, "FABQ_Work_PreOp")
    validate_numeric_range(data.get("classe_asa_1"), 0, 4, "classe_asa_1")
    validate_numeric_range(data.get("MORBIDITY"), 0, 100, "MORBIDITY")

    return errors


def make_predictions_hip_knee(data):
    input_data = pd.DataFrame.from_dict(data, orient="index").T
    # input_data['sesso'] = input_data['sesso'].apply(check_gender)
    predictionsR = predictions_hipAndKneeR(input_data, "single_patient")
    predictionsC = predictions_hipAndKneeC(input_data, "single_patient")

    results = {
        "predictionsR": predictionsR,
        "predictionsC": predictionsC
    }

    return results


def make_predictions_spine(data):
    input_data = pd.DataFrame.from_dict(data, orient="index").T
    input_data = preprocessSpine(input_data)

    predictionsR = predictions_SpineR(input_data, "single_patient")
    predictionsC = predictions_SpineC(input_data, "single_patient")

    results = {
        "predictionsR": predictionsR,
        "predictionsC": predictionsC
    }

    return results


