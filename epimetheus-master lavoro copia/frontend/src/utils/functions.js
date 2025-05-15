// this function need to pass the array with the arrays with values of elements of counterfactual
// scoreValueChosenInWizard è la scelta physical o mental
export function createCounterfactual(counterfactData, scoreValueChosenInWizard) {
  const valuesToChangeVisualization = [];

  // Verifica che counterfactData sia presente e abbia i dati giusti
  if (
    !counterfactData ||
    (scoreValueChosenInWizard === "Physical" && (!counterfactData.physical || counterfactData.physical.length === 0)) ||
    (scoreValueChosenInWizard === "Mental" && (!counterfactData.mental || counterfactData.mental.length === 0))
  ) {
    console.warn("❌ Counterfactual data is missing or invalid:", counterfactData);
    return valuesToChangeVisualization; // Restituisce array vuoto e previene crash
  }

  scoreValueChosenInWizard = scoreValueChosenInWizard.replace(/"/g, "");


  // nel caso in cui abbia letto da localstorage ci sono le virgolette da rimuovere
  scoreValueChosenInWizard = scoreValueChosenInWizard.replace(/"/g, "");
  if (scoreValueChosenInWizard === "Physical") {
    // mi creo due liste corrispondenti ai due array di counterfactData che mi arriva dal BE.
    // queste liste saranno le select che permetteranno di aggiornare il grafico
    for (let i = 0; i < 2; i++) {
      // aggiungo la label di riferimento
      if (counterfactData.physical[i][0] == "BMI_peso_PreOp") {
        valuesToChangeVisualization.push("BMI_peso_PreOp");
        for (let j = 1; j < 10; j++) {
          // if (counterfactData.physical[i][j] > 0) {
            valuesToChangeVisualization.push(
              counterfactData.physical[i][j].toFixed(2)
            );
          // }
        }
      } else {
        // aggiungo la label di riferimento
        valuesToChangeVisualization.push(counterfactData.physical[1][0]);
        for (let j = 1; j < 10; j++) {
          // if (counterfactData.physical[i][j] > 0) {
            valuesToChangeVisualization.push(
              counterfactData.physical[i][j].toFixed(2)
            );
          // }
        }
      }
    }
  } else if (scoreValueChosenInWizard == "Mental") {
    for (let i = 0; i < 2; i++) {
      // aggiungo la label di riferimento
      if (counterfactData.mental[i][0] == "SF12_PhysicalScore_PreOp") {
        valuesToChangeVisualization.push("SF12_PhysicalScore_PreOp");
        for (let j = 1; j < 10; j++) {
          // if (counterfactData.physical[i][j] > 0) {
            valuesToChangeVisualization.push(counterfactData.mental[i][j]);
          }
        // }
      } else {
        valuesToChangeVisualization.push(counterfactData.mental[1][0]);
        for (let j = 1; j < 10; j++) {
          // if (counterfactData.physical[i][j] > 0) {
            valuesToChangeVisualization.push(counterfactData.mental[i][j]);
          }
        // }
      }
    }
  }
  return valuesToChangeVisualization;
}

// Function to set new results coordinate by physical score
// data è tutta la response,
// patientCompiledForm è il form compilato dall'utente,
// valuesToChangeVisualization sono le due select tra cui l'utente deve scegliere,
export function newResultsP(
  data,
  patientCompiledForm,
  valuesToChangeVisualization,
  firstSelectOfEditableParameters,
  secondSelectOfEditableParameters
) {
  const dataPrediction = data.predictions.predictionsR.predictions[1];
  const pred_len = dataPrediction.length;
  let objOfPatient;

  let p0 = valuesToChangeVisualization[0]; // dovrebbe essere "BMI_peso_PreOp" nel caso di physical

  let select0 = firstSelectOfEditableParameters;
  let select1 = secondSelectOfEditableParameters;

  let p1 = valuesToChangeVisualization[10]; // dovrebbe essere "SF12_PhysicalScore_PreOp" nel caso di physical

  // scorro l'array delle predizioni controfattuali e:
  // 1) controllo che tutti i campi del controfattuale siano nell'oggetto corrente
  // 2) controllo che il valore dei campi dell'oggetto sia uguale al valore scelto dall'utente
  // se i controlli sono superati inserisco il valore della predizione nella tabella

  for (let i = 0; i < pred_len; i++) {
    if (p0 in dataPrediction[i] && p1 in dataPrediction[i]) {
      if (
        select0 == dataPrediction[i][p0].toFixed(2) &&
        select1 == dataPrediction[i][p1].toFixed(2)
      ) {
        objOfPatient = {
          predictionR_6M: dataPrediction[i].predictionR[0],
          predictionC_6M: dataPrediction[i].predictionC[0],
          SF12_PhysicalScore_6months:
            data.predictions.predictionsR.predictions[0]
              .SF12_PhysicalScore_6months,
          SF12_MentalScore_6months:
            data.predictions.predictionsR.predictions[0]
              .SF12_MentalScore_6months,
          physicalScore_preop: dataPrediction[i].SF12_PhysicalScore_PreOp,
          mentalScore_preop: patientCompiledForm.mentalScore_PreOp,
          scoreCPreOp: data.predictions.predictionsC.physical_classif_score[0],
          weight: dataPrediction[i].BMI_peso_PreOp,
        };
      }
    }
  }
  return objOfPatient;
}

// Function to set new results coordinate by mental or ODI score
export function newResultsM(
  data,
  patientCompiledForm,
  valuesToChangeVisualization,
  firstSelectOfEditableParameters,
  secondSelectOfEditableParameters
) {
  const dataPrediction = data.predictions.predictionsR.predictions[2];

  const pred_len = dataPrediction.length;
  let objOfPatient;

  let p0 = valuesToChangeVisualization[0];
  let select0 = firstSelectOfEditableParameters;
  let select1 = secondSelectOfEditableParameters;
  let p1 = valuesToChangeVisualization[10];

  // procedo come nell'altra funzione, corro l'array, quando trovo il match tra il valore scelto dall'utente
  // e ciò che è presente nelle predizioni allora creo l'oggetto paziente
  for (let i = 0; i < pred_len; i++) {
    if (p0 in dataPrediction[i] && p1 in dataPrediction[i]) {
      if (
        select0 == dataPrediction[i][p0] &&
        select1 == dataPrediction[i][p1]
      ) {
        objOfPatient = {
          predictionR_6M: dataPrediction[i].predictionR[0],
          predictionC_6M: dataPrediction[i].predictionC[0],
          SF12_PhysicalScore_6months:
            data.predictions.predictionsR.predictions[0]
              .SF12_PhysicalScore_6months,
          SF12_MentalScore_6months:
            data.predictions.predictionsR.predictions[0]
              .SF12_MentalScore_6months,
          physicalScore_preop: dataPrediction[i].SF12_PhysicalScore_PreOp,
          mentalScore_preop: dataPrediction[i].SF12_MentalScore_PreOp,
          scoreCPreOp: data.predictions.predictionsC.mental_classif_score[0],
          age: dataPrediction[i].anni_ricovero,
        };
      }
    }
  }
  return objOfPatient;
}

export function convertFormLabelIntoUserFriendlyLabel(formLabel) {
  if (formLabel === "anni_ricovero") return "Età";
  if (formLabel === "SF12_PhysicalScore_PreOp")
    return "SF12 PhysicalScore PreOp";
  if (formLabel === "SF12_MentalScore_PreOp") return "SF12 MentalScore PreOp";
  if (formLabel === "BMI_peso_PreOp") return "BMI peso PreOp";
}

/****************************************************************** */
// VALIDATING FUNCTIONS FOR EACH FIELD

export function validateField(fieldName, fieldValue) {
  let isValid = true;

  switch (fieldName) {
    case "anni_ricovero":
      isValid = validateAge(fieldValue);
      break;
    case "bmi_altezza_preOp":
      isValid = validateHeight(fieldValue);
      break;
    case "bmi_peso_preOp":
      isValid = validateWeight(fieldValue);
      break;
    case "VAS_Total_PreOp":
      isValid = validateVAS(fieldValue);
      break;
    case "physicalScore":
      isValid = validateSF12Physical(fieldValue);
      break;
    case "mentalScore":
      isValid = validateSF12Mental(fieldValue);
      break;
    case "SF12_autovalsalute_risp_0":
      isValid = validateSelfAssessment(fieldValue);
      break;
    case "SF12_scale_risp_0":
      isValid = validateResponseScale(fieldValue);
      break;
    case "SF12_ultimomeseresa_risp_0":
      isValid = validateYield(fieldValue);
      break;
    case "SF12_ultimomeselimite_risp_0":
      isValid = validateLimit(fieldValue);
      break;
    case "SF12_ultimomeseemo_risp_0":
      isValid = validateEmo(fieldValue);
      break;
    case "SF12_ultimomeseostacolo_risp_0":
      isValid = validateHurdle(fieldValue);
      break;
    case "SF12_ultimomesesereno_risp_0":
      isValid = validateClear(fieldValue);
      break;
    case "SF12_ultimomeseenergia_risp_0":
      isValid = validateEnergy(fieldValue);
      break;
    case "SF12_ultimomesetriste_risp_0":
      isValid = validateSadness(fieldValue);
      break;
    case "SF12_ultimomesesociale_risp_0":
      isValid = validateSocialization(fieldValue);
      break;
    case "ODI_Total_PreOp":
      isValid = validateODI(fieldValue);
      break;
    case "Vas_Back_PreOp":
      isValid = validateVASBack(fieldValue);
      break;
    case "Vas_Leg_PreOp":
      isValid = validateVASLeg(fieldValue);
      break;
    case "SF36_GeneralHealth_PreOp" ||
      "SF36_PhysicalFunctioning_PreOp" ||
      "SF36_RoleLimitPhysical_PreOp" ||
      "SF36_RoleLimitEmotional_PreOp" ||
      "SF36_SocialFunctioning_PreOp" ||
      "SF36_Pain_PreOp" ||
      "SF36_EnergyFatigue_PreOp" ||
      "SF36_EmotionalWellBeing_PreOp" ||
      "SF36_MentalScore_PreOp" ||
      "SF36_PhysicalScore_PreOp":
      isValid = validateSF36(fieldValue);
      break;

    case "FABQ_Work_PreOp":
      isValid = validateFABQ(fieldValue);
      break;

    default:
      break;
  }

  return isValid;
}

export function validateAge(input) {
  let isValid = false;
  let errorMessage = "";
  const ageInput = input;
  const age = parseInt(ageInput, 10);
  if (age < 0 || age > 200) {
    isValid = false;
    errorMessage = "Age must be between 0 and 200";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateHeight(input) {
  let isValid = false;
  let errorMessage = "";
  const heightInput = input;
  const height = parseInt(heightInput, 10);
  if (height < 30 || height > 300) {
    isValid = false;
    errorMessage = "Height must be between 30 and 300";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateWeight(input) {
  let isValid = false;
  const weightInput = input;
  let errorMessage = "";
  const weight = parseInt(weightInput, 10);
  if (weight < 1 || weight > 1000) {
    isValid = false;
    errorMessage = "Weight must be between 1 and 1000";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateVAS(input) {
  let isValid = false;
  const vasInput = input;
  let errorMessage = "";
  const vas = parseInt(vasInput, 10);
  if (vas < 0 || vas > 10) {
    isValid = false;
    errorMessage = "VAS must be between 0 and 10";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateSF12Physical(input) {
  let isValid = false;
  let errorMessage = "";
  const physicalScoreInput = input;
  const physicalScore = parseInt(physicalScoreInput, 10);
  if (physicalScore < 0 || physicalScore > 100) {
    isValid = false;
    errorMessage = "Physical score must be between 0 and 100";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}
export function validateSF12Mental(input) {
  let isValid = false;
  let errorMessage = "";
  const mentalScoreInput = input;
  const mentalScore = parseInt(mentalScoreInput, 10);
  if (mentalScore < 0 || mentalScore > 100) {
    isValid = false;
    errorMessage = "Mental score must be between 0 and 100";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateSelfAssessment(input) {
  let isValid = false;
  let errorMessage = "";
  const selfAssessmentInput = input;
  const selfAssessment = parseInt(selfAssessmentInput, 10);
  if (selfAssessment < 0 || selfAssessment > 4) {
    isValid = false;
    errorMessage = "Self Assessment must be between 0 and 4";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateResponseScale(input) {
  let isValid = false;
  let errorMessage = "";
  const responseScaleInput = input;
  const responseScale = parseInt(responseScaleInput, 10);
  if (responseScale < 0 || responseScale > 10) {
    isValid = false;
    errorMessage = "Response scale must be between 0 and 10";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateYield(input) {
  let isValid = false;
  let errorMessage = "";
  const yieldInput = input;
  const value = parseInt(yieldInput, 10);
  if (value < 0 || value > 1) {
    isValid = false;
    errorMessage = "Yield must be 0 or 1";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateLimit(input) {
  let isValid = false;
  let errorMessage = "";
  const limitInput = input;
  const limit = parseInt(limitInput, 10);
  if (limit < 0 || limit > 1) {
    isValid = false;
    errorMessage = "Limit must be 0 or 1";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateEmo(input) {
  let isValid = false;
  let errorMessage = "";
  const emoInput = input;
  const emo = parseInt(emoInput, 10);
  if (emo < 0 || emo > 1) {
    isValid = false;
    errorMessage = "Emo must be 0 or 1";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateHurdle(input) {
  let isValid = false;
  let errorMessage = "";
  const hurdleInput = input;
  const hurdle = parseInt(hurdleInput, 10);
  if (hurdle < 0 || hurdle > 4) {
    isValid = false;
    errorMessage = "Hurdle must be between 0 and 4";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateClear(input) {
  let isValid = false;
  let errorMessage = "";
  const clearInput = input;
  const clear = parseInt(clearInput, 10);
  if (clear < 0 || clear > 5) {
    isValid = false;
    errorMessage = "Clear must be between 0 and 5";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateEnergy(input) {
  let isValid = false;
  let errorMessage = "";
  const energyInput = input;
  const energy = parseInt(energyInput, 10);
  if (energy < 0 || energy > 5) {
    isValid = false;
    errorMessage = "Energy must be between 0 and 5";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateSadness(input) {
  let isValid = false;
  let errorMessage = "";
  const sadnessInput = input;
  const sadness = parseInt(sadnessInput, 10);
  if (sadness < 0 || sadness > 5) {
    isValid = false;
    errorMessage = "Sadness must be between 0 and 5";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateSocialization(input) {
  let isValid = false;
  let errorMessage = "";
  const socializationInput = input;
  const socialization = parseInt(socializationInput, 10);
  if (socialization < 0 || socialization > 4) {
    isValid = false;
    errorMessage = "Socialization must be between 0 and 4";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateODI(input) {
  let isValid = false;
  let errorMessage = "";
  const odiInput = input;
  const odi = parseInt(odiInput, 10);
  if (odi < 0 || odi > 100) {
    isValid = false;
    errorMessage = "ODI must be between 0 and 100";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateVASBack(input) {
  let isValid = false;
  let errorMessage = "";
  const vasInput = input;
  const vas = parseInt(vasInput, 10);
  if (vas < 0 || vas > 10) {
    isValid = false;
    errorMessage = "VAS Back must be between 0 and 10";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateVASLeg(input) {
  let isValid = false;
  let errorMessage = "";
  const vasInput = input;
  const vas = parseInt(vasInput, 10);
  if (vas < 0 || vas > 10) {
    isValid = false;
    errorMessage = "VAS Leg must be between 0 and 10";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateFABQ(input) {
  let isValid = false;
  let errorMessage = "";
  const fabqInput = input;
  const fabq = parseInt(fabqInput, 10);
  if (fabq < 0 || fabq > 66) {
    isValid = false;
    errorMessage = "FABQ must be between 0 and 66";
  } else {
    isValid = true;
  }
  return { isValid, errorMessage };
}

export function validateSF36(input) {
  let isValid = true; // Assume all elements are valid initially
  let errorMessage = "";

  //  const sf36List = [
  //    document.getElementById("SF36_GeneralHealth_PreOp"),
  //    document.getElementById("SF36_PhysicalFunctioning_PreOp"),
  //    document.getElementById("SF36_RoleLimitPhysical_PreOp"),
  //    document.getElementById("SF36_RoleLimitEmotional_PreOp"),
  //    document.getElementById("SF36_SocialFunctioning_PreOp"),
  //    document.getElementById("SF36_Pain_PreOp"),
  //    document.getElementById("SF36_EnergyFatigue_PreOp"),
  //    document.getElementById("SF36_EmotionalWellBeing_PreOp"),
  //    document.getElementById("SF36_MentalScore_PreOp"),
  //    document.getElementById("SF36_PhysicalScore_PreOp")
  //  ];

  //  for (let i = 0; i < sf36List.length; i++) {
  //    const sf36Input = sf36List[i];
  //    const sf36 = parseInt(sf36Input.value, 10);
  if (input < 0 || input > 100) {
    isValid = false;
    errorMessage = "All SF36 values must be between 0 and 100";
  }
  //  }
  return { isValid, errorMessage };
}
