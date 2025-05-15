import React, { useEffect, useRef } from "react";
import circle_image from "./../assets/images/stateofCircle.png";

const CircularGraph = ({ patientData }) => {
  const barPositionRef = useRef(null);
  const circlePositionRef = useRef(null);

  useEffect(() => {
    if (barPositionRef.current) {
      barPositionRef.current.style.left =
        100 - patientData.predictionC_6M * 100 + "%";
    }

    // Applica la posizione del cerchio utilizzando useRef
    if (circlePositionRef.current) {
      circlePositionRef.current.style.backgroundPositionX =
        patientData.predictionC_6M * 100 + "%";
    }
  }, [patientData]);
  return (
    <div className="row mt-4">
      <h4>Circular graph</h4>
      <h5>Patient status 6 month post operations</h5>
      <div className="d-flex">
        <div className="col-3">
          <p>
            In this graph, the outer gradient band defines the various health
            status ranges. The central colored circle is filled with a color
            that varies according to the patient's health status, representing
            one of the colors in the gradient. The bar divided into three
            sections (uncertain, stable, and improved) represents the possible
            health status ranges.
          </p>
        </div>
        {/* <!--Circular gradient chart--> */}
        <div className="d-flex flex-column ms-5 align-items-center">
          <div style={{ height: "500px" }}>
            <div className="position-relative">
              <div className="circular-graph mt-5">
                <div
                  className="content-wrapper"
                  id="circleGradient"
                  ref={circlePositionRef}
                ></div>
              </div>
              <div className="improved position-absolute">
                <img src={circle_image} />
              </div>
            </div>
          </div>

          <div className="ms-5">
            <div className="d-flex pb-3 mb-3">
              <div className="d-flex position-relative mt-5" style={{ width: '450px'}}>
                <div className="bar-el bar-worsened"></div>
                <div className="bar-el bar-stable"></div>
                <div className="bar-el bar-improved"></div>
                <div id="valueBar" ref={barPositionRef}></div>
              </div>
              <div className="mx-5">
                <p className="mb-1">Legend:</p>
                <p className="mb-0 fs-6 mig position-relative">Improved</p>
                <p className="mb-0 fs-6 stab position-relative">Uncertain</p>
                <p className="mb-0 peg position-relative">Worsened</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CircularGraph.propTypes = {};

export default CircularGraph;
