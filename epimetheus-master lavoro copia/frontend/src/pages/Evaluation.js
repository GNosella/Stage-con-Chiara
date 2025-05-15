import axios from "axios";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from "react-toastify";

const Evaluation = () => {
  const [platformEvaluationForm, setPlatformEvaluationForm] = useState({
    platformComprehensibility: "",
    platformComprehensibilityReason: "",
    circularGraphUsefulness: "",
    circularGraphUsefulnessReason: "",
    violinplotGrapUsefulness: "",
    violinplotGrapUsefulnessReason: "",
    boxplotGraphUsefulness: "",
    boxplotGraphUsefulnessReason: "",
    patientInformations: "",
    patientInformationsDetail: "",
    suggestions: "",
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const urlPlatformEvaluationForm =
    "http://127.0.0.1:5000/api/submit_platform_evaluation_form";

  const handleInputChange = (identifier, event) => {
    setPlatformEvaluationForm((prevValues) => ({
      ...prevValues,
      [identifier]: event.target.value,
    }));
  };

  const handleFieldBlur = (fieldName) => {
    setTouchedFields((prevTouchedFields) => ({
      ...prevTouchedFields,
      [fieldName]: true,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setErrors({ ...errors, ...validateForm() });
      setTouchedFields((prevTouchedFields) => ({
        ...prevTouchedFields,
        ...getTouchedFields(form),
      }));
      return;
    }

    try {
      const response = await axios.post(
        urlPlatformEvaluationForm,
        platformEvaluationForm
      );
      console.log(response);
      if (response.status === 200) {
        toast.success(`Evaluation sent successfully`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error(`Something went wrong, please try again later`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Errore durante la richiesta:", error.message);
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!platformEvaluationForm.platformComprehensibility) {
      errors["platformComprehensibility"] = "Required";
    }

    return errors;
  };

  const getTouchedFields = (form) => {
    const touched = {};
    Array.from(form.elements).forEach((element) => {
      if (element.tagName === "INPUT" && element.type === "radio") {
        touched[element.name] = true;
      }
    });
    return touched;
  };

  return (
    <section className="container">
      <ToastContainer />

      <div className="w-100 border-bottom py-3 d-flex flex-row">
        <i className="bi bi-caret-left-fill"></i>
        <a href="/results">Go back to results</a>
      </div>
      <Form onSubmit={handleSubmit}>
        <div className="form-bg">
          <h5 className="fw-bolder">The platform</h5>
          <Form.Group className="mb-3" id="platformComprehensibility">
            <Form.Label className="mt-3 fw-medium">
              Do you find this platform easy to use? *
            </Form.Label>
            <div>
              <Form.Check
                type="radio"
                id="platformComprehensibility-true"
                label="Yes"
                name="platformComprehensibility"
                value="true"
                required
                onBlur={() => handleFieldBlur("platformComprehensibility")}
                checked={
                  platformEvaluationForm.platformComprehensibility === "true"
                }
                onChange={(event) =>
                  handleInputChange("platformComprehensibility", event)
                }
              />

              <Form.Check
                type="radio"
                id="platformComprehensibility-false"
                label="No"
                name="platformComprehensibility"
                value="false"
                required
                onBlur={() => handleFieldBlur("platformComprehensibility")}
                checked={
                  platformEvaluationForm.platformComprehensibility === "false"
                }
                onChange={(event) =>
                  handleInputChange("platformComprehensibility", event)
                }
              />
            </div>
            {touchedFields["platformComprehensibility"] &&
              errors["platformComprehensibility"] && (
                <div className="text-danger">
                  {errors["platformComprehensibility"]}
                </div>
              )}

            <Form.Label className="mt-3 fw-medium">If not, why?</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={platformEvaluationForm.platformComprehensibilityReason}
              onChange={(event) =>
                handleInputChange("platformComprehensibilityReason", event)
              }
            />
          </Form.Group>
        </div>

        <div className="form-bg">
          <h5 className="fw-bolder">I grafici</h5>
          <Form.Group className="mb-3" id="circularGraphUsefulness">
            <Form.Label className="mt-3 fw-medium">
              Did you find the "Patient status 6 months post-operation" graph
              useful? *
            </Form.Label>
            <div>
              <Form.Check
                type="radio"
                id="circularGraphUsefulness-true"
                label="Yes"
                name="circularGraphUsefulness"
                value="true"
                required
                onBlur={() => handleFieldBlur("circularGraphUsefulness")}
                checked={
                  platformEvaluationForm.circularGraphUsefulness === "true"
                }
                onChange={(event) =>
                  handleInputChange("circularGraphUsefulness", event)
                }
              />

              <Form.Check
                type="radio"
                id="circularGraphUsefulness-false"
                label="No"
                name="circularGraphUsefulness"
                value="false"
                required
                onBlur={() => handleFieldBlur("circularGraphUsefulness")}
                checked={
                  platformEvaluationForm.circularGraphUsefulness === "false"
                }
                onChange={(event) =>
                  handleInputChange("circularGraphUsefulness", event)
                }
              />
            </div>
            {touchedFields["circularGraphUsefulness"] &&
              errors["circularGraphUsefulness"] && (
                <div className="text-danger">
                  {errors["circularGraphUsefulness"]}
                </div>
              )}

            <Form.Label className="mt-3 fw-medium">If not, why?</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={platformEvaluationForm.circularGraphUsefulnessReason}
              onChange={(event) =>
                handleInputChange("circularGraphUsefulnessReason", event)
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" id="violinplotGrapUsefulness">
            <Form.Label className="mt-3 fw-medium">
              Did you find the "Comparison of pre-operation and 6-month
              post-operational situation" graph useful? *
            </Form.Label>
            <div>
              <Form.Check
                type="radio"
                id="violinplotGrapUsefulness-true"
                label="Yes"
                name="violinplotGrapUsefulness"
                value="true"
                required
                onBlur={() => handleFieldBlur("violinplotGrapUsefulness")}
                checked={
                  platformEvaluationForm.violinplotGrapUsefulness === "true"
                }
                onChange={(event) =>
                  handleInputChange("violinplotGrapUsefulness", event)
                }
              />

              <Form.Check
                type="radio"
                id="violinplotGrapUsefulness-false"
                label="No"
                name="violinplotGrapUsefulness"
                value="false"
                required
                onBlur={() => handleFieldBlur("violinplotGrapUsefulness")}
                checked={
                  platformEvaluationForm.violinplotGrapUsefulness === "false"
                }
                onChange={(event) =>
                  handleInputChange("violinplotGrapUsefulness", event)
                }
              />
            </div>
            {touchedFields["violinplotGrapUsefulness"] &&
              errors["violinplotGrapUsefulness"] && (
                <div className="text-danger">
                  {errors["violinplotGrapUsefulness"]}
                </div>
              )}

            <Form.Label className="mt-3 fw-medium">If not, why?</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={platformEvaluationForm.violinplotGrapUsefulnessReason}
              onChange={(event) =>
                handleInputChange("violinplotGrapUsefulnessReason", event)
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" id="patientInformations">
            <Form.Label className="mt-3 fw-medium">
              Are there any other pieces of information you think are necessary
              to evaluate the patient's situation? *
            </Form.Label>
            <div>
              <Form.Check
                type="radio"
                id="patientInformations-true"
                label="Yes"
                name="patientInformations"
                value="true"
                required
                onBlur={() => handleFieldBlur("patientInformations")}
                checked={platformEvaluationForm.patientInformations === "true"}
                onChange={(event) =>
                  handleInputChange("patientInformations", event)
                }
              />

              <Form.Check
                type="radio"
                id="patientInformations-false"
                label="No"
                name="patientInformations"
                value="false"
                required
                onBlur={() => handleFieldBlur("patientInformations")}
                checked={platformEvaluationForm.patientInformations === "false"}
                onChange={(event) =>
                  handleInputChange("patientInformations", event)
                }
              />
            </div>
            {touchedFields["patientInformations"] &&
              errors["patientInformations"] && (
                <div className="text-danger">
                  {errors["patientInformations"]}
                </div>
              )}

            <Form.Label className="mt-3 fw-medium">If not, why?</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={platformEvaluationForm.patientInformationsDetail}
              onChange={(event) =>
                handleInputChange("patientInformationsDetail", event)
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" id="boxplotGraphUsefulness">
            <Form.Label className="mt-3 fw-medium">
              Did you find the "Patient status 6 month post operation" graph
              useful? *
            </Form.Label>
            <div>
              <Form.Check
                type="radio"
                id="boxplotGraphUsefulness-true"
                label="Yes"
                name="boxplotGraphUsefulness"
                value="true"
                required
                onBlur={() => handleFieldBlur("boxplotGraphUsefulness")}
                checked={
                  platformEvaluationForm.boxplotGraphUsefulness === "true"
                }
                onChange={(event) =>
                  handleInputChange("boxplotGraphUsefulness", event)
                }
              />

              <Form.Check
                type="radio"
                id="boxplotGraphUsefulness-false"
                label="No"
                name="boxplotGraphUsefulness"
                value="false"
                required
                onBlur={() => handleFieldBlur("boxplotGraphUsefulness")}
                checked={
                  platformEvaluationForm.boxplotGraphUsefulness === "false"
                }
                onChange={(event) =>
                  handleInputChange("boxplotGraphUsefulness", event)
                }
              />
            </div>
            {touchedFields["boxplotGraphUsefulness"] &&
              errors["boxplotGraphUsefulness"] && (
                <div className="text-danger">
                  {errors["boxplotGraphUsefulness"]}
                </div>
              )}

            <Form.Label className="mt-3 fw-medium">If not, why?</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={platformEvaluationForm.boxplotGraphUsefulnessReason}
              onChange={(event) =>
                handleInputChange("boxplotGraphUsefulnessReason", event)
              }
            />
          </Form.Group>
        </div>

        <div className="form-bg">
          <h5 className="fw-bolder">Other</h5>
          <Form.Group className="mb-3" id="suggestions">
            <Form.Label className="mt-3 fw-medium">
              Do you have any other comments or suggestions?
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={3}
              value={platformEvaluationForm.suggestions}
              onChange={(event) => handleInputChange("suggestions", event)}
            />
          </Form.Group>
        </div>
        <button className="btn btn-primary my-5" type="submit">
          Invia
        </button>
      </Form>
    </section>
  );
};

export default Evaluation;
