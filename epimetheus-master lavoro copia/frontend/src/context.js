import React, { useState, useContext, useEffect } from "react";
import useSubmitFormData from "./useSubmitFormData";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardFormData, setWizardFormData] = useState({
    procedure :'',
    preference : '',
    score : '',
    dataSource : '',
  }  ); // Inizializza con i dati predefiniti
  const [query, setQuery] = useState("");
  const [patientCompiledForm, setPatientCompiledForm] = useState(""); //è il form compilato dall'utente nello step2
  const [data, setData] = useState(null); //è la response che arriva dal BE
  const [isLoading, setIsLoading] = useState(false); //mi serve per visualizzare il loading o l'errore nella pagina results
  const [scoreValue, setScoreValue] = useState("");
  const {
    isLoading: loadingData,
    data: responseData,
    isError,
    listOfAPIErrors
  } = useSubmitFormData(`${query}`, patientCompiledForm);

  // Caricamento dei dati dal localStorage all'avvio dell'applicazione
  useEffect(() => {
    const visualizationData = localStorage.getItem("visualizationResponse");
    const patientForm = localStorage.getItem("submittedPatientForm");
    const score = localStorage.getItem("scoreValue");
    if (visualizationData && visualizationData.length !== 0) {
      setData(JSON.parse(visualizationData));
      setPatientCompiledForm(patientForm);
      setScoreValue(score);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (responseData.length !== 0) {
      setData(responseData);
    }
  }, [responseData]);

  const cleanOldData = () => {
    setData(null);
    localStorage.removeItem("visualizationResponse");
  };

  const goToNextStep = () => {
    if (currentStep !== 3) setCurrentStep(currentStep + 1);
  };

  const goToPreviusStep = () => {
    if (currentStep !== 1) setCurrentStep(currentStep - 1);
  };

  //Effettua la predizione: Quando cambia Query, ho un nuovo render dei grafici
  const getPrediction = (query, compiledForm) => {
    setQuery(query);
    setPatientCompiledForm(compiledForm);
  };

  return (
    <AppContext.Provider
      value={{
        currentStep,
        goToNextStep,
        goToPreviusStep,
        wizardFormData,
        setWizardFormData,
        data,
        isLoading,
        isError,
        cleanOldData,
        getPrediction,
        scoreValue,
        setScoreValue,
        patientCompiledForm,
        setPatientCompiledForm,
        query,
        setQuery,
        listOfAPIErrors
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useGlobalContext };
