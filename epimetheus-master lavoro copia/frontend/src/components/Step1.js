import { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import Form from "react-bootstrap/Form";
import { choisesStep1, choicesStep2 } from "../utils/constants";


const Step1 = ({ onComplete }) => {

const [taskType, setTaskType] = useState('');
const [taskOptions, setTaskOptions] = useState([]);
const [tasksList, setTasksList] = useState({});
const [selectedTask, setSelectedTask] = useState('');

const { wizardFormData, setWizardFormData } = useGlobalContext();

useEffect(() => {
  fetch("/Configs/tasks_list.json")
    .then((res) => res.json())
    .then((data) => setTasksList(data));
}, []);

useEffect(() => {
  if (taskType && tasksList[taskType]) {
    setTaskOptions(tasksList[taskType]);
  } else {
    setTaskOptions([]);
  }
}, [taskType, tasksList]);

  const [inputProcedure, setInputProcedure] = useState("");
  const [preferenceSelection, setPreferenceSelection] = useState(
    choicesStep2.OPTION_BALANCED_PREDICTION
  ); // metto un valore di default

  useEffect(() => {
    // Quando il componente viene montato imposta il valore iniziale in base al valore
    // presente in wizardFormData
    setInputProcedure(wizardFormData.procedure || "");
    setPreferenceSelection(
      wizardFormData.preference || choicesStep2.OPTION_BALANCED_PREDICTION
    );

    // Controlla se entrambe le selezioni sono fatte per sbloccare il bottone
    if (
      (wizardFormData.procedure || "").trim() !== "" &&
      (
        wizardFormData.preference || choicesStep2.OPTION_BALANCED_PREDICTION
      ).trim() !== ""
    ) {
      onComplete(true);
    }
  }, [wizardFormData.procedure, wizardFormData.preference, onComplete]);

  const handleProcedureSelection = (e) => {
    const value = e.target.selectedOptions[0].value; // Leggi il valore selezionato
    setInputProcedure(value);

    let copyOfWizardFormData = { ...wizardFormData };
    copyOfWizardFormData.procedure = value;

    setWizardFormData(copyOfWizardFormData);

    if (
      copyOfWizardFormData.procedure.trim() !== "" &&
      copyOfWizardFormData.preference.trim() !== ""
    )
      onComplete(true);
  };

  const handlePreferenceSelection = (choice) => {
    setPreferenceSelection(choice);
    let copyOfWizardFormData = { ...wizardFormData };
    copyOfWizardFormData.preference = choice;

    setWizardFormData(copyOfWizardFormData);

    if (
      copyOfWizardFormData.preference.trim() !== "" &&
      copyOfWizardFormData.procedure.trim() !== ""
    )
      onComplete(true);
  };

  return (
    <>
      <div className="mt-2">
        <h3 className="primaryColor">Requirement selection</h3>
        <p>Select the procedure for which you want to make the decision</p>

        <Form className="col-3">
          <Form.Group className="mt-4">
  <Form.Label>Category</Form.Label>
  <Form.Select
    value={taskType}
    onChange={(e) => setTaskType(e.target.value)}
  >
    <option value="">Select category</option>
    {Object.keys(tasksList).map((cat) => (
      <option key={cat} value={cat}>
        {cat.charAt(0).toUpperCase() + cat.slice(1)}
      </option>
    ))}
  </Form.Select>
</Form.Group>

{taskType && (
  <Form.Group className="mt-3">
    <Form.Label>Procedure</Form.Label>
    <Form.Select
      value={selectedTask}
      onChange={(e) => {
        const selected = e.target.value;
        setSelectedTask(selected);

        let updated = { ...wizardFormData };
        updated.procedure = selected;
        setWizardFormData(updated);
      }}
    >
      <option value="">Select procedure</option>
      {taskOptions.map((task) => (
        <option key={task} value={task}>
          {task}
        </option>
      ))}
    </Form.Select>
  </Form.Group>
)}
        </Form>
      </div>
      <div className="mt-5">
        <h3 className="primaryColor">Preference selection</h3>
        <div className="d-flex flex-row col-6 justify-content-between">
          {Object.values(choicesStep2).map((preference) => (
            <div
              key={preference}
              className="d-flex flex-row align-items-center"
            >
              <input
                type="radio"
                id={preference}
                name="step2Choice"
                value={preference}
                key={preference}
                checked={preferenceSelection === preference}
                onChange={() => handlePreferenceSelection(preference)}
              />
              <label htmlFor={preference} className="ms-2">
                {preference}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Step1;
