import React from "react";
import "./stepIndicator.css";

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="step-indicator d-flex justify-content-center mt-4">
      {steps.map((step, index) => {
        return (
          <div key={step.id} className='d-flex flex-row'> {/* Usa step.id come key */}
            <div
              className={`step ${step.id < currentStep ? "completed" : ""} ${
                step.id === currentStep ? "current" : ""
              }`}
            >
              {index + 1}
            </div>
            {step.id < steps.length && <div className="lineToNext"></div>} {/* Correzione per non mostrare la linea dopo l'ultimo step */}
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;