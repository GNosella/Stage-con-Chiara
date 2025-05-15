import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const ModalContent = ({ hideModal }) => {
  const [perceivedUsefulness, setPerceivedUsefulness] = useState(null);
  const [changedIdea, setChangedIdea] = useState(null);
  const [perceivedUsefulnessReason, setPerceivedUsefulnessReason] =
    useState("");
  const [changedIdeaReason, setChangedIdeaReason] = useState("");

  const urlSubmitForm = "http://127.0.0.1:5000/api/submit_modal_form";

  const [compiledForm, setCompiledForm] = useState({
    perceived_usefulness: "",
    perceived_usefulness_reason: "",
    changed_idea: "",
    changed_idea_reason: "",
  });

  const numbers = [1, 2, 3, 4, 5, 6];

  const handlePerceivedUsefulness = (event) => {
    const value = event.target.value;
    setPerceivedUsefulness(value);
    setCompiledForm((prevState) => ({
      ...prevState,
      perceived_usefulness: value,
    }));
  };

  const handlePerceivedUsefulnessReason = (event) => {
    const value = event.target.value;
    setPerceivedUsefulnessReason(value);
    setCompiledForm((prevState) => ({
      ...prevState,
      perceived_usefulness_reason: value,
    }));
  };

  const handleChangedIdea = (event) => {
    const value = event.target.value;
    setChangedIdea(value);
    setCompiledForm((prevState) => ({
      ...prevState,
      changed_idea: value,
    }));
  };

  const handleChangedIdeaReason = (event) => {
    const value = event.target.value;
    setChangedIdeaReason(value);
    setCompiledForm((prevState) => ({
      ...prevState,
      changed_idea_reason: value,
    }));
  };

  const handleFormSubmit = async () => {
    console.log(compiledForm);

    try {
      const response = await axios.post(urlSubmitForm, compiledForm);
      console.log(response);
      if (response.status === 200) {
        hideModal(true);
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

  return (
    <div className="p-5">
      <ToastContainer />
      <Modal.Header>
        <Modal.Title>Your opinion is important</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="fw-semibold">
          How useful do you find the support received from this platform? *
        </p>
        <div className="d-flex flex-row">
          <span>Absolutely useless</span>
          {numbers.map((usefulness) => (
            <div key={usefulness} className="form-check mx-3">
              <input
                type="radio"
                id={`radio${usefulness}`}
                name="perceivedUsefulness"
                value={usefulness}
                checked={perceivedUsefulness === String(usefulness)}
                onChange={handlePerceivedUsefulness}
                className="form-check-input"
              />
              <label
                htmlFor={`radio${usefulness}`}
                className="form-check-label"
              >
                {usefulness}
              </label>
            </div>
          ))}
          <span>Totally useful</span>
        </div>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label className="fw-semibold mt-3">Why?</Form.Label>
          <Form.Control
            as="textarea"
            value={perceivedUsefulnessReason}
            onChange={(e) => {
              handlePerceivedUsefulnessReason(e);
            }}
            rows={3}
          />
        </Form.Group>

        <p className="mt-5 fw-semibold">
          Have you changed your mind based on the insights from the graphs? *
        </p>
        <div className="d-flex flex-row">
          <span>Insignificant</span>
          {numbers.map((number) => (
            <div key={number} className="form-check mx-3">
              <input
                type="radio"
                id={`radio${number}`}
                name="changedIdea"
                value={number}
                checked={changedIdea === String(number)}
                onChange={(e) => {
                  handleChangedIdea(e);
                }}
                className="form-check-input"
              />
              <label htmlFor={`radio${number}`} className="form-check-label">
                {number}
              </label>
            </div>
          ))}
          <span>It made me change my mind</span>
        </div>

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label className="fw-semibold mt-3">Why?</Form.Label>
          <Form.Control
            as="textarea"
            onChange={(e) => {
              handleChangedIdeaReason(e);
            }}
            value={changedIdeaReason}
            rows={3}
          />
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={handleFormSubmit}
          disabled={!perceivedUsefulness || !changedIdea}
          variant="primary"
        >
          Save changes
        </Button>
      </Modal.Footer>
    </div>
  );
};

export default ModalContent;
