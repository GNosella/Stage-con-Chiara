import { useEffect, useState } from "react";
import axios from "axios";

const useSubmitFormData = (scoreType, form) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [listOfAPIErrors, setListOfAPIErrors] = useState([]);

  useEffect(() => {
    if (scoreType !== "") {
      (async () => {
        setIsError(false);
        setIsLoading(true);
        try {
          // Carica la configurazione JSON dal public/Configs/
          const configRes = await fetch(`/Configs/${scoreType}.json`);
          const config = await configRes.json();

          const backendUrl = config.url;           // es. /data/analysis
          const method = config.method || "POST";  // default POST
          const features = config.features || [];  // array di feature da usare

          // Prepara solo i dati necessari
          const payload = {
            score: scoreType,
            dataSource: "patientEpisode",
          };
          features.forEach((f) => {
            payload[f] = form[f] ?? 0;
          });

          const response = await axios({
            url: `http://127.0.0.1:5000${backendUrl}`,
            method,
            data: payload,
          });

          setData(response.data);
          setIsLoading(false);
          localStorage.setItem('visualizationResponse', JSON.stringify(response.data));
          localStorage.setItem('submittedPatientForm', JSON.stringify(form));
        } catch (e) {
          console.error("API Error:", e);
          setIsError(true);
          if (e.response?.status === 500) {
            setListOfAPIErrors(["Errore generico, contattare l'assistenza"]);
          } else {
            setListOfAPIErrors(e.response?.data?.errors || [e.response?.data?.error || "Errore sconosciuto"]);
          }
        }
      })();
    }
  }, [scoreType]);

  return { isLoading, data, isError, listOfAPIErrors };
};

export default useSubmitFormData;
