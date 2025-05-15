import React, { useState } from "react";
import { useGlobalContext } from "../context";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../components/StepIndicator.js/StepIndicator";
import { steps } from "../utils/constants";

const Wizard = () => {
  const { currentStep, goToNextStep, goToPreviusStep, data } =
    useGlobalContext();

  const [isStepValid, setIsStepValid] = useState(false);

  const navigate = useNavigate();

  const handleStepCompletion = (isStepValid) => {
    //se è valido sblocco il bottone per passare allo step successivo
    setIsStepValid(isStepValid);
  };

  const goToNextStepAndResetIsStepValid = () => {
    goToNextStep();
    if (currentStep !== 2) setIsStepValid(false);
  };

  const renderStatesComponent = (state) => {
    return (
      <>
        {state === 1 && (
          <Step1 onComplete={(data) => handleStepCompletion(data)} />
        )}
        {state === 2 && (
          <>
            <Step1 onComplete={(data) => handleStepCompletion(data)} />
            <Step2 onComplete={() => goToNextStep()} />
          </>
        )}
      </>
    );
  };

  return (
    <section className="container">
      <StepIndicator steps={steps} currentStep={currentStep} />

      {renderStatesComponent(currentStep)}

      <div className="d-flex justify-content-between my-5">
        <button
          className="btn btn-outline-primary"
          onClick={() => goToPreviusStep()}
        >
          Back
        </button>
        <button
          className="btn btn-primary"
          hidden={currentStep === 2}
          disabled={!isStepValid}
          onClick={() => goToNextStepAndResetIsStepValid()}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default Wizard;
