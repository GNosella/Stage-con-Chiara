import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import Form from "react-bootstrap/Form";
import { choisesStep3Source, choisesStep3Score } from "../utils/constants";
import PatientDataForm from "./PatientDataForm";

const Step2 = ({ onComplete }) => {
  const [selectedScore, setSelectedScore] = useState("");

  //mock: siccome a BE non funziona l'utilizzo del file, al momento di default metto la scelta manuale
  const [selectedDataSource, setSelectedDataSource] = useState(
    choisesStep3Source.OPTION_MANUALLY
  );

  const { wizardFormData, setWizardFormData, setScoreValue } =
    useGlobalContext();

  useEffect(() => {
    setSelectedScore(wizardFormData.score);
    setScoreValue(wizardFormData.score);
    setSelectedDataSource(wizardFormData.dataSource);
    localStorage.setItem("scoreValue", JSON.stringify(wizardFormData.score));
  }, [wizardFormData.score, wizardFormData.dataSource]);

  const handleSelectedScore = (score) => {
    setSelectedScore(score.target.value === "Physical" ? 0 : 1);

    let copyOfWizardFormData = { ...wizardFormData };
    copyOfWizardFormData.score = score.target.value;

    setWizardFormData(copyOfWizardFormData);
  };

  // const handleSelectedDataSource = (source) => {
  //   setSelectedDataSource(source);
  //   let copyOfWizardFormData = { ...wizardFormData };
  //   copyOfWizardFormData.dataSource = source;
  //   setWizardFormData(copyOfWizardFormData);
  // };

  return (
    <div className="mt-5">
      {/* MOCK: nascondo perchè  BE la lettura del file non funziona
       <div className="row mb-3">
        <p className="mt-3">Data source</p>
        {Object.values(choisesStep3Source).map((source) => (
          <div key={source}>
            <input
              key={source}
              type="radio"
              id={source}
              name="step2Choice"
              value={source}
              checked={selectedDataSource === source}
              onChange={() => handleSelectedDataSource(source)}
              required
            />
            <label htmlFor={source}>{source}</label>
          </div>
        ))}
      </div> */}

      {/* <div hidden={selectedDataSource !== choisesStep3Source.OPTION_MANUALLY}> */}
      <div className="mt-5">
        <PatientDataForm
          selectedScore={selectedScore}
          procedureValue={wizardFormData.procedure}
          onComplete={onComplete}
        />
      </div>
    </div>
  );
};

export default Step2;
