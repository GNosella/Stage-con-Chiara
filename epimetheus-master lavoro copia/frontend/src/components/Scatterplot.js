import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { nest } from "d3-collection";

const Scatterplot = ({ objOfPatient, parsedResponse, scoreValue }) => {
  const svgRef = useRef();

  useEffect(() => {
    /* scatter plot */
    let margin = { top: 10, right: 30, bottom: 100, left: 100 },
      width = 400 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // Selezione dell'elemento SVG utilizzando la reference
    const svg = d3
      .select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let dataViz = parsedResponse.predictions.predictionsR.similar_patients;
    let patientData = objOfPatient;
    let objToAnalyze = [];
    if (scoreValue == "Physical") {
      objToAnalyze = dataViz.slice(0, 4);
      objToAnalyze.forEach((el) => {
        el.isTester = "noF";
      });
    } else {
      objToAnalyze = dataViz.slice(5, 9);
      objToAnalyze.forEach((el) => {
        el.isTester = "noM";
      });
    }
    patientData.isTester = "yes";
    objToAnalyze.push(patientData);

    // Add X axis
    var x = d3.scaleLinear().domain([0, 100]).range([0, width]);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(6));

    // Add Y axis
    var y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y).ticks(6));

    var color = d3
      .scaleOrdinal()
      .domain(["yes", "noM", "noF"])
      .range(["#961A3C", "#E2A525", "#E2A525"]);

    // Add dots
    svg
      .append("g")
      .selectAll("dot")
      .data(objToAnalyze)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        if (d.age !== undefined) return x(d.age);
      })
      .attr("cy", function (d) {
        if (d.SF12_PhysicalScore_6months !== undefined)
          return y(d.SF12_PhysicalScore_6months);
      })
      .attr("r", 3)
      .style("fill", function (d) {
        return color(d.isTester);
      });

    if (scoreValue == "Physical") {
      svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("x", width - 150)
        .attr("y", height + margin.top + 30)
        .text("Age");
      svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 60)
        .attr("x", -margin.top - 150)
        .text("SF12 Physical Score");
    } else {
      svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("x", width - 150)
        .attr("y", height + margin.top + 30)
        .text("Age");
      svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 60)
        .attr("x", -margin.top - 150)
        .text("SF12 Mental Score");
    }
  }, [objOfPatient, parsedResponse, scoreValue]);

  return (
    <svg ref={svgRef} className="scatterPlot1">
      <h3>Patient status 6 months post operation</h3>
      <div className="position-relative">
        <div className="chart-wrapper" id="plotWBox">
          <div></div>
        </div>
        <div className="position-absolute isBoxGrad"></div>
      </div>
    </svg>
  );
};

export default Scatterplot;
