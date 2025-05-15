import { useState, useEffect } from "react";
import { validateField } from "./../utils/functions";
import { formDataManually, operationEnum } from "../utils/constants";
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FormField({ field, value, onChange }) {
  if (field.type === "radio") {
    return (
      <>
        {field.options.map((option, index) => (
          <div key={index} className="d-flex flex-row align-items-center">
            <input
              className="form-check-input mt-0"
              type="radio"
              name={field.name}
              value={option}
              checked={value === option}
              onChange={onChange}
            />
            <label className="ms-2">{option}</label>
          </div>
        ))}
      </>
    );
  } else if (field.type === "select") {
    return (
      <select
        className="form-control form-select"
        name={field.name}
        value={value}
        onChange={onChange}
      >
        {field.options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  } else {
    return (
      <input
        className="form-control"
        type={field.type}
        name={field.name}
        value={value}
        onChange={onChange}
        id={field.name}
      />
    );
  }
}

export default function PatientDataForm({
  selectedScore,
  procedureValue,
  onComplete,
}) {
  const {
    wizardFormData,
    setQuery,
    setPatientCompiledForm,
    patientCompiledForm,
    cleanOldData,
  } = useGlobalContext();

  const navigate = useNavigate();
  const [formStructure, setFormStructure] = useState([]);
  const [enteredValues, setEnteredValues] = useState(() => {
    // Crea un oggetto iniziale con chiavi basate sulla formStructure (se disponibile)
    return formStructure.reduce((acc, field) => {
      acc[field.name] = ''; // o un altro valore di default
      return acc;
    }, {});
  });

  useEffect(() => {
    console.log("Carico JSON per:", procedureValue);
    if (procedureValue) {
      fetch(`/Configs/${procedureValue}.json`)
        .then((res) => res.json())
        .then((config) => {
          const inputs = Object.keys(config.input_features || {}).map((key) => ({
            name: key,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
            type: config.input_features[key].type || "text",
            validation: config.input_features[key].validation || "",
          }));
          setFormStructure(inputs);
          // Aggiorna anche enteredValues con le nuove chiavi, se necessario
          setEnteredValues(prevValues => {
            const newValues = {};
            inputs.forEach(input => {
              newValues[input.name] = prevValues[input.name] || '';
            });
            return newValues;
          });
        });
    } else {
      setFormStructure([]);
      setEnteredValues({});
    }
  }, [procedureValue]);
  

  //mi servirà per visualizzare i toast per quei campi che non hanno superato la validazione
  const [listOfInvalidFields, setListOfInvalidFields] = useState([]);

  // mi serve per visualizzare i dati all'interno dei rispettivi input text qualora l'utente abbia già fatto una prima predizione 
  const compiledFormConvertedInObj = (() => {
    try {
      return JSON.parse(patientCompiledForm) || {};
    } catch (e) {
      return patientCompiledForm || {};
    }
  })();

  const selectFormAccordingStep1Choise =
    wizardFormData.procedure === "Spine"
      ? formDataManually.Spine
      : formDataManually.Default;

  const handleResetPatientDataForm = (event) => {
    event.preventDefault();
    setEnteredValues({});
    cleanOldData();
    setPatientCompiledForm("");
    localStorage.removeItem("submittedPatientForm");
  };
      

  const handleSubmit = (event) => {
    event.preventDefault();
    // pulisci lista di campi non validi subito dopo il submit per non lasciare in rosso quelli che sono stati corretti in un precedente tentativo
    setListOfInvalidFields([]);

    const invalidFields = [];
    let formData = enteredValues;

    // Esegui la validazione dei campi
    for (const fieldName in formData) {
      if (formData.hasOwnProperty(fieldName)) {
        const fieldValue = formData[fieldName];
        let isValid = true;
        let errorMessage = "";

        // Ottieni il nome della funzione di validazione
        const validationFunctionName = selectFormAccordingStep1Choise.find(
          (field) => field.name === fieldName
        )?.validation;

        // Verifica se la funzione di validazione è definita
        if (validationFunctionName && fieldValue) {
          const validationResult = validateField(fieldName, fieldValue);
          isValid = validationResult.isValid;
          errorMessage = validationResult.errorMessage;
        } else if (fieldValue === undefined || fieldValue === "") {
          isValid = false;
          errorMessage = "Il campo è obbligatorio";
        } else {
          // Se non viene trovata la funzione di validazione, considera il campo valido
          isValid = true;
          errorMessage = "";
        }

        if (!isValid) {
          const userFieldName = (fieldName) =>
            Object.values(formDataManually).flatMap(
              (formData) =>
                formData.find((field) => field.name === fieldName)?.label ||
                null
            )[0];
          invalidFields.push({
            fieldName: userFieldName(fieldName) ?? fieldName,
            errorMessage,
          });
          setListOfInvalidFields((prevList) => [...prevList, fieldName]);
        }
      }
    }

    // Se ci sono campi non validi, mostra i toast
    if (invalidFields.length > 0) {
      invalidFields.forEach((field) => {
        toast.error(
          `Il campo ${field.fieldName} non è valido: ${field.errorMessage}`,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            progress: undefined,
            theme: "colored",
          }
        );
      });
      return;
    }

    // se va tutto bene procedi con il submit del form, quindi converti da stringa in numer tutto 
    // ciò che dovrebbe essere numero secondo il BE
    let numericValues = Object.fromEntries(
      Object.entries(enteredValues).map(([key, value]) => [
        key,
        !isNaN(value) && value !== "" ? parseFloat(value) : value,
      ])
    );
    

    // se sto compilando il form mi devo assicurare di eliminare prima i vecchi dati che avevo
    cleanOldData();
    setPatientCompiledForm(numericValues);
    setQuery(wizardFormData.procedure);
    onComplete();
    navigate(`/results`);

    // Invia i dati del form
    console.log("Dati del form inviati:", formData);
  };

  const isFieldInvalid = (fieldName) => listOfInvalidFields.includes(fieldName);

  return (
    <div>
      <ToastContainer />
      <div style={{ backgroundColor: "#eee", padding: "10px", marginBottom: "20px" }}>
  <strong>Procedura selezionata:</strong> {procedureValue}
</div>
      <form className="row" onSubmit={handleSubmit}>
        {formStructure.map((field, index) => (
          <div
            key={index}
            className={`form-group patient-data-form col-xl-4 col-md-6 col-12 mb-3 ${
              isFieldInvalid(field.name) ? "invalid-field" : ""
            }`}
          >
            <label>{field.label}</label>
            {field.name === "gender" ? (
  <div className="form-group">
    <div className="form-check">
      <input
        className="form-check-input"
        type="radio"
        name="gender"
        id="male"
        value="Male"
        checked={enteredValues["gender"] === "Male"}
        onChange={(e) =>
          setEnteredValues((prev) => ({ ...prev, gender: e.target.value }))
        }
      />
      <label className="form-check-label" htmlFor="male">Male</label>
    </div>
    <div className="form-check">
      <input
        className="form-check-input"
        type="radio"
        name="gender"
        id="female"
        value="Female"
        checked={enteredValues["gender"] === "Female"}
        onChange={(e) =>
          setEnteredValues((prev) => ({ ...prev, gender: e.target.value }))
        }
      />
      <label className="form-check-label" htmlFor="female">Female</label>
    </div>
  </div>
) : (
  <FormField
    field={field}
    value={enteredValues[field.name]}
    onChange={(event) =>
      setEnteredValues((prev) => ({ ...prev, [field.name]: event.target.value }))
    }
  />
)}

          </div>
        ))}
        <div className="d-flex flex-row justify-content-between w-100">
              <button className="btn btn-outline-primary" onClick={handleResetPatientDataForm}>Reset</button>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
        </div>
      </form>
    </div>
  );
}
