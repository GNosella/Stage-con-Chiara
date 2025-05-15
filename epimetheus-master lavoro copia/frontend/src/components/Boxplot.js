import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { nest } from "d3-collection";

const Boxplot = ({ patientData, scoreValueChosenInWizard }) => {
  const svgRef = useRef();

  useEffect(() => {
    let newDataset = [];
    newDataset.push(patientData);
    let margin = { top: 10, right: 10, bottom: 40, left: 40 },
      width = 350 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(svgRef.current)
      .style("background-color", "transparent")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // Add X axis
    var x = d3.scaleLinear().domain([0, 100]).range([0, width]).nice();
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(6));

    // Add Y axis
    var y = d3.scaleLinear().domain([0, 100]).range([height, 0]).nice();
    svg.append("g").call(d3.axisLeft(y).ticks(6));

    if (scoreValueChosenInWizard == "Physical") {
      svg
        .append("g")
        .selectAll("dot")
        .data(newDataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return x(d.physicalScore_preop);
        })
        .attr("cy", function (d) {
          return y(d.SF12_PhysicalScore_6months);
        })
        .attr("r", 3)
        .style("fill", "#BADAE9");

      svg
        .append("g")
        .selectAll("dot")
        .data(newDataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return x(d.physicalScore_preop);
        })
        .attr("cy", function (d) {
          return y(d.SF12_PhysicalScore_6months);
        })
        .attr("r", 10)
        .attr("stroke", "#BADAE9")
        .attr("fill", "none");

      // Add the path using this helper function
      svg
        .append("g")
        .selectAll("dot")
        .data(newDataset)
        .enter()
        .append("line")
        .attr("x1", function (d) {
          return x(d.physicalScore_preop);
        })
        .attr("x2", function (d) {
          return x(d.physicalScore_preop);
        })
        .attr("y1", function (d) {
          return y(d.SF12_PhysicalScore_6months + 10);
        })
        .attr("y2", function (d) {
          return y(d.SF12_PhysicalScore_6months - 10);
        })
        .attr("stroke", "#BADAE9")
        .style("width", 1);

      svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("x", width - 250)
        .attr("y", height + margin.top + 25)
        .text("Physical score preOp");
      svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 12)
        .attr("x", -margin.top - 180)
        .text("Physical score 6 months");
    }
    if (scoreValueChosenInWizard == "Mental") {
      svg
        .append("g")
        .selectAll("dot")
        .data(newDataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return x(d.mentalScore_preop);
        })
        .attr("cy", function (d) {
          return y(d.SF12_MentalScore_6months);
        })
        .attr("r", 3)
        .style("fill", "#BADAE9");

      svg
        .append("g")
        .selectAll("dot")
        .data(newDataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return x(d.mentalScore_preop);
        })
        .attr("cy", function (d) {
          return y(d.SF12_MentalScore_6months);
        })
        .attr("r", 10)
        .attr("stroke", "#BADAE9")
        .attr("fill", "none");

      // Add the path using this helper function
      svg
        .append("g")
        .selectAll("dot")
        .data(newDataset)
        .enter()
        .append("line")
        .attr("x1", function (d) {
          return x(d.mentalScore_preop);
        })
        .attr("x2", function (d) {
          return x(d.mentalScore_preop);
        })
        .attr("y1", function (d) {
          return y(d.SF12_MentalScore_6months + 10);
        })
        .attr("y2", function (d) {
          return y(d.SF12_MentalScore_6months - 10);
        })
        .attr("stroke", "#BADAE9")
        .style("width", 1);

      svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("x", width - 250)
        .attr("y", height + margin.top + 25)
        .text("Mental score preOp");
      svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 12)
        .attr("x", -margin.top - 180)
        .text("Mental score 6 months");
    }
    if (scoreValueChosenInWizard == "ODI") {
      svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("x", width - 250)
        .attr("y", height + margin.top + 25)
        .text("ODI preOp");
      svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 12)
        .attr("x", -margin.top - 180)
        .text("ODI 6 months");
    }
  }, [scoreValueChosenInWizard, patientData]);

  return (
    <div className="row">
      <h4>Boxplot</h4>
      <h5>
        Comparison of pre-operation and 6-month post-operational situation
      </h5>
      <div className="d-flex justify-content-between">
        <div className="col-3">
          <p>
            Chart evaluating the patient's condition six months after surgery,
            comparing the preoperative physical and mental scores with those six
            months post-operation.
          </p>
        </div>

        <div className="position-relative mx-5 mt-5">
          <svg ref={svgRef} className="plotWBox"></svg>
          <div className="position-absolute isBoxGrad"></div>
        </div>
      </div>
    </div>
  );
};

export default Boxplot;
