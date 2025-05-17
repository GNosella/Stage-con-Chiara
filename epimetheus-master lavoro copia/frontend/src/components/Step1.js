import { useEffect, useState } from "react";
import { useGlobalContext } from "../context";
import Form from "react-bootstrap/Form";
import { choisesStep1, choicesStep2 } from "../utils/constants";

const Step1 = ({ onComplete }) => {
  const [taskType, setTaskType] = useState("");
  const [taskOptions, setTaskOptions] = useState([]);
  const [tasksList, setTasksList] = useState({});
  const [selectedTask, setSelectedTask] = useState("");

  const { wizardFormData, setWizardFormData } = useGlobalContext();

  useEffect(() => {
    fetch("/Configs/tasks_list.json")
      .then((res) => res.json())
      .then((data) => setTasksList(data))
      .catch((err) => console.error("Failed to load tasks_list.json:", err));
  }, []);

  useEffect(() => {
    if (taskType && tasksList[taskType]) {
      setTaskOptions(tasksList[taskType]);
    } else {
      setTaskOptions([]);
    }
  }, [taskType, tasksList]);

  const handleTaskTypeSelection = (e) => {
    const value = e.target.value;
    setTaskType(value);
    setSelectedTask("");
  };

  const handleTaskSelection = (e) => {
    const selected = e.target.value;
    setSelectedTask(selected);

    const updated = { ...wizardFormData };
    updated.procedure = selected;
    updated.score = selected; 
    setWizardFormData(updated);

    console.log("Updated wizardFormData:", updated);

    if (taskType && selected) {
      onComplete(true); 
    }
  };

  const handlePreferenceSelection = (choice) => {
    const updated = { ...wizardFormData };
    updated.preference = choice;
    setWizardFormData(updated);
  };

  return (
    <>
      <div className="mt-2">
        <h3 className="primaryColor">Category Selection</h3>
        <Form className="col-3">
          <Form.Group className="mt-4">
            <Form.Label>Category</Form.Label>
            <Form.Select value={taskType} onChange={handleTaskTypeSelection}>
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
              <Form.Select value={selectedTask} onChange={handleTaskSelection}>
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
        <h3 className="primaryColor">Preference Selection</h3>
        <div className="d-flex flex-row col-6 justify-content-between">
          {Object.values(choicesStep2).map((preference) => (
            <div key={preference} className="d-flex flex-row align-items-center">
              <input
                type="radio"
                id={preference}
                name="step2Choice"
                value={preference}
                checked={wizardFormData.preference === preference}
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
