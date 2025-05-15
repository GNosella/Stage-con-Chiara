import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import {
  createCounterfactual,
  newResultsP,
  newResultsM,
  convertFormLabelIntoUserFriendlyLabel,
} from "../utils/functions";
import Violinplot from "../components/Violinplot";
import Boxplot from "../components/Boxplot";
import Tab from "react-bootstrap/Tab";
import Modal from "react-bootstrap/Modal";
import ModalContent from "../components/ModalContent";
import Form from "react-bootstrap/Form";
import StepIndicator from "../components/StepIndicator.js/StepIndicator";
import { steps } from "../utils/constants";
import CircularGraph from "../components/CircularGraph";
import { useNavigate } from "react-router-dom";
import ErrorApiMessage from "../components/ErrorApiMessage";
import { ToastContainer, toast } from "react-toastify";
import Nav from "react-bootstrap/Nav";
import "./results.css";

const Results = () => {
  const contextValues = useGlobalContext();
  console.log("Valori dal context:", contextValues);
  const { patientCompiledForm, data, isError, scoreValue, setScoreValue } = contextValues;

    const [firstSelectOfEditableParameters, setFirstSelectOfEditableParameters] =
    useState(null);
    const [
      secondSelectOfEditableParameters,
      setSecondSelectOfEditableParameters,
    ] = useState(null);
    const [patientData, setPatientData] = useState(null); ///mi servirà per far comparire i grafici dopo tutti i calcoli
    const [valuesToChangeVisualization, setValuesToChangeVisualization] =
    useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Boxplot");
    const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const prediction =
  typeof patientCompiledForm === "object" && patientCompiledForm?.prediction
    ? patientCompiledForm.prediction
    : null;


  // nel caso in cui scorevalue sia stato letto dal local storage pulisco il dato dalle virgolette
  useEffect(() => {
    if (scoreValue) {
      setScoreValue(scoreValue.replace(/"/g, ""));
    }
  }, [scoreValue]);

  // passo 1: mi genero l'array di valori/dimensioni con cui posso operare modifiche ai grafici
  useEffect(() => {
    if (
      !data ||
      !data.predictions ||
      !data.predictions.predictionsR ||
      !data.predictions.predictionsR.counterfactual
    ) return;
    
  
    const score = scoreValue.replace(/"/g, "");
    const array = createCounterfactual(
      data.predictions.predictionsR.counterfactual,
      score
    );
  
    if (array.length !== 0) {
      setValuesToChangeVisualization(array);
      setFirstSelectOfEditableParameters(array[5]);
      setSecondSelectOfEditableParameters(array[15]);
    }
  }, [data]);
  

  // passo 2: dopo aver ottenuto l'array di dimensioni variabili calcolo l'oggetto paziente che mi servirà per visualizzare i grafici 
  useEffect(() => {
    if (
      firstSelectOfEditableParameters !== null &&
      secondSelectOfEditableParameters !== null
    ) {

      let objOfPatient;
      if (scoreValue === "Physical")
        objOfPatient = newResultsP(
          data,
          patientCompiledForm,
          valuesToChangeVisualization,
          firstSelectOfEditableParameters,
          secondSelectOfEditableParameters
        );
      else {
        console.log("entra nel mental");
        objOfPatient = newResultsM(
          data,
          patientCompiledForm,
          valuesToChangeVisualization,
          firstSelectOfEditableParameters,
          secondSelectOfEditableParameters
        );
      }
      setPatientData(objOfPatient);

      if (objOfPatient) setIsLoading(false);
    }
  }, [
    firstSelectOfEditableParameters,
    secondSelectOfEditableParameters,
    // data,
    valuesToChangeVisualization,
    // scoreValue,
  ]);


  const handleChangeTabInTabbar = (key) => {
    setActiveTab(key);
    const modalForm = localStorage.getItem("compiledModalForm");
    if (key === "allgraphs" && modalForm === null && modalForm !== "true") {
      setShowModal(true);
    }
  };

  const handleCloseModal = (shouldClose) => {
    if (shouldClose) {
      toast.success(`Form sent successfully`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
        theme: "colored",
      });
      setShowModal(false);
      localStorage.setItem("compiledModalForm", "true");
    }
  };

  const handleFirstSelect = (event) => {
    setIsLoading(true);
    setFirstSelectOfEditableParameters(event.target.value);
  };

  const handleSecondSelect = (event) => {
    setIsLoading(true);
    setSecondSelectOfEditableParameters(event.target.value);
  };

  return (
    <section className="container mb-5">
      <ToastContainer />
      <StepIndicator steps={steps} currentStep={3} />
      {!isLoading ? (
        <div className="row">
          <div className="w-100 border-bottom py-2">
            <i className="bi bi-caret-left-fill"></i>
            <a href="/" className=" py-3">
              Go back to compilation
            </a>
          </div>

          <div>
            <h3 className="my-4 primaryColor">Results</h3>

            <Tab.Container
              id="left-tabs-example"
              defaultActiveKey="first"
              activeKey={activeTab}
              onSelect={handleChangeTabInTabbar}
            >
              <div className="d-flex flex-column">
                <div className="d-flex flex-row justify-content-between">
                  <Nav variant="pills" className="flex-row fake-tabs">
                    <Nav.Item>
                      <Nav.Link eventKey="Boxplot">Boxplot</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="violinplot">Violinplot</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="circulargraph">
                        Circulargraph
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="allgraphs">All graphs</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <button
                    onClick={() => {
                      navigate(`/evaluation`);
                    }}
                    className="btn btn-outline-primary"
                  >
                    Evaluate platform
                  </button>
                </div>
                <div>
                  <Tab.Content>
                    <Tab.Pane eventKey="Boxplot">
                      <div className="mt-4">
                        <div className="row">
                          <div className="d-lg-flex justify-content-between">
                            {valuesToChangeVisualization && (
                              <div className="col-lg-4 border p-4 editable-parameters-form mb-5">
                                <h4>Editable parameters</h4>
                                <Form>
                                  <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <Form.Label>
                                      {convertFormLabelIntoUserFriendlyLabel(
                                        valuesToChangeVisualization[0]
                                      )}
                                    </Form.Label>
                                    <Form.Select
                                      aria-label="first select"
                                      onChange={(e) => handleFirstSelect(e)}
                                      value={
                                        firstSelectOfEditableParameters || ""
                                      }
                                    >
                                      <option value="">Select</option>
                                      {Object.values(
                                        valuesToChangeVisualization
                                      )
                                        .slice(1, 9)
                                        .map((value) => {
                                          const numericValue =
                                            parseFloat(value); // Converti la stringa in numero
                                          return (
                                            <option key={value} value={value}>
                                              {isNaN(numericValue)
                                                ? value
                                                : numericValue.toFixed(2)}{" "}
                                              {/* Controlla se è un numero */}
                                            </option>
                                          );
                                        })}
                                    </Form.Select>
                                  </Form.Group>

                                  <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlInput1"
                                  >
                                    <Form.Label>
                                      {convertFormLabelIntoUserFriendlyLabel(
                                        valuesToChangeVisualization[10]
                                      )}
                                    </Form.Label>
                                    <Form.Select
                                      aria-label="second select"
                                      onChange={(e) => handleSecondSelect(e)}
                                      value={
                                        secondSelectOfEditableParameters || ""
                                      }
                                    >
                                      <option value="">Select</option>
                                      {Object.values(
                                        valuesToChangeVisualization
                                      )
                                        .slice(11, 19)
                                        .map((value) => {
                                          const numericValue =
                                            parseFloat(value); // Converti la stringa in numero
                                          return (
                                            <option key={value} value={value}>
                                              {isNaN(numericValue)
                                                ? value
                                                : numericValue.toFixed(2)}{" "}
                                            </option>
                                          );
                                        })}
                                    </Form.Select>
                                  </Form.Group>
                                </Form>
                              </div>
                            )}
                            <div className="ms-lg-5">
                              {/* <Scatterplot
                                patientData={patientData}
                                    parsedResponse={data}
                                    scoreValue={scoreValue}
                                /> */}

                              <Boxplot
                                patientData={patientData}
                                scoreValueChosenInWizard={scoreValue}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="violinplot">
                      <div className="mt-4">
                        <div className="d-lg-flex justify-content-between">
                          {valuesToChangeVisualization && (
                            <div className="col-lg-4 border p-4 editable-parameters-form">
                              <h4>Editable parameters</h4>
                              <Form>
                                <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Label>
                                    {convertFormLabelIntoUserFriendlyLabel(
                                      valuesToChangeVisualization[0]
                                    )}
                                  </Form.Label>
                                  <Form.Select
                                    aria-label="first select"
                                    onChange={(e) => handleFirstSelect(e)}
                                    value={
                                      firstSelectOfEditableParameters || ""
                                    }
                                  >
                                    <option value="">Select</option>
                                    {Object.values(
                                        valuesToChangeVisualization
                                      )
                                        .slice(1, 9)
                                        .map((value) => {
                                          const numericValue =
                                            parseFloat(value); // Converti la stringa in numero
                                          return (
                                            <option key={value} value={value}>
                                              {isNaN(numericValue)
                                                ? value
                                                : numericValue.toFixed(2)}{" "}
                                            </option>
                                          );
                                        })}
                                  </Form.Select>
                                </Form.Group>

                                <Form.Group
                                  className="mb-3"
                                  controlId="exampleForm.ControlInput1"
                                >
                                  <Form.Label>
                                    {convertFormLabelIntoUserFriendlyLabel(
                                      valuesToChangeVisualization[10]
                                    )}
                                  </Form.Label>
                                  <Form.Select
                                    aria-label="second select"
                                    onChange={(e) => handleSecondSelect(e)}
                                    value={
                                      secondSelectOfEditableParameters || ""
                                    }
                                  >
                                    <option value="">Select</option>
                                    {Object.values(
                                        valuesToChangeVisualization
                                      )
                                        .slice(11, 19)
                                        .map((value) => {
                                          const numericValue =
                                            parseFloat(value); // Converti la stringa in numero
                                          return (
                                            <option key={value} value={value}>
                                              {isNaN(numericValue)
                                                ? value
                                                : numericValue.toFixed(2)}{" "}
                                            </option>
                                          );
                                        })}
                                  </Form.Select>
                                </Form.Group>
                              </Form>
                            </div>
                          )}
                          <div className="ms-lg-5">
                            {patientData ? (
                              <Violinplot
                                patientData={patientData}
                                dataset={
                                  data.predictions.predictionsR.other_patients
                                }
                                keyTab={"violinplot"}
                              />
                            ) : (
                              <div></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="circulargraph">
                      <CircularGraph patientData={patientData} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="allgraphs">
                      <div className="border p-5 my-5">
                        {patientData ? (
                          <Boxplot
                            patientData={patientData}
                            scoreValueChosenInWizard={scoreValue}
                          />
                        ) : (
                          <div></div>
                        )}
                      </div>

                      <div className="border p-5 mb-3">
                        {patientData ? (
                          <Violinplot
                            patientData={patientData}
                            dataset={
                              data.predictions.predictionsR.other_patients
                            }
                            keyTab={"allgraphs"}
                          />
                        ) : (
                          <div></div>
                        )}
                      </div>

                      <div className="mt-4 row border p-5 mb-5">
                        <CircularGraph patientData={patientData} />
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </div>
            </Tab.Container>
          </div>

          <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
            <ModalContent hideModal={handleCloseModal} />
          </Modal>
        </div>
      ) : isError ? (
        <ErrorApiMessage />
      ) : (
        <div
          id="spinner"
          className="d-flex justify-content-center align-items-center my-5 py-4"
        >
          <strong className="text-darker-blue me-4">Loading results</strong>
          <div className="spinner-grow text-darker-blue mx-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow text-blue mx-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow text-azure mx-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="spinner-grow text-celeste mx-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </section>
  );
};

export default Results;
