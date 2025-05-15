import React from "react";
import { useGlobalContext } from "../context";

const ErrorApiMessage = () => {
  const { listOfAPIErrors } = useGlobalContext();
  return (
    <div className="row">
        <a href="/" className=" py-3 border-bottom">
              Go back to compilation
            </a>
      <div className="d-flex flex-column justify-content-start mt-4">
        <h5>Qualcosa è andato storto </h5>
        {listOfAPIErrors.map((error) => {
          return <p>{error}</p>;
        })}
      </div>
    </div>
  );
};

export default ErrorApiMessage;
