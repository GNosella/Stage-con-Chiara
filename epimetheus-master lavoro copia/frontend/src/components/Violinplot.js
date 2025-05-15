import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { nest } from "d3-collection";

const Violinplot = ({ patientData, dataset, keyTab }) => {
  const violinRef = useRef();
  useEffect(() => {
    var margin = { top: 10, right: 30, bottom: 30, left: 40 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3
      .select(violinRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Build and Show the Y scale
    var y = d3
      .scaleLinear()
      .domain([0, 1]) // Note that here the Y scale is set manually
      .range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
    var x = d3
      .scaleBand()
      .range([0, width])
      .domain(["preOp", "6months"])
      .padding(0.05); // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Features of the histogram
    var histogram = d3
      .histogram()
      .domain(y.domain())
      .thresholds(y.ticks(20)) // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
      .value((d) => d);

    // Compute the binning for each group of the dataset
    var sumstat = nest() // nest function allows to group the calculation per level of a factor
      .key(function (d) {
        return d.period;
      })
      .rollup(function (d) {
        // For each key..
        var input = d.map(function (g) {
          return g.score;
        }); // Keep the variable called Sepal_Length
        var bins = histogram(input); // And compute the binning on it.
        return bins;
      })
      .entries(dataset);
    // What is the biggest number of value in a bin? We need it cause this value will have a width of 100% of the bandwidth.
    var maxNum = 0;
    for (var i in sumstat) {
      var allBins = sumstat[i].value;
      var lengths = allBins.map(function (a) {
        return a.length;
      });
      var longuest = d3.max(lengths);
      if (longuest > maxNum) {
        maxNum = longuest;
      }
    }

    // The maximum width of a violin must be x.bandwidth = the width dedicated to a group
    var xNum = d3
      .scaleLinear()
      .range([0, x.bandwidth()])
      .domain([-maxNum, maxNum]);

    // Add the shape to this svg!
    svg
      .selectAll("myViolin")
      .data(sumstat)
      .enter() // So now we are working group per group
      .append("g")
      .attr("transform", function (d) {
        return "translate(" + x(d.key) + " ,0)";
      }) // Translation on the right to be at the group position
      .append("path")
      .datum(function (d) {
        return d.value;
      }) // So now we are working bin per bin
      .style("stroke", "none")
      .style("fill", "#C4C4C4")
      .attr(
        "d",
        d3
          .area()
          .x0(function (d) {
            return xNum(-d.length);
          })
          .x1(function (d) {
            return xNum(d.length);
          })
          .y(function (d) {
            return y(d.x0);
          })
          .curve(d3.curveCatmullRom)
      ); // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference

    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    var sumstatBox = nest() // nest function allows to group the calculation per level of a factor
      .key(function (d) {
        return d.period;
      })
      .rollup(function (d) {
        var q1 = d3.quantile(
          d
            .map(function (g) {
              return g.score;
            })
            .sort(d3.ascending),
          0.25
        );
        var median = d3.quantile(
          d
            .map(function (g) {
              return g.score;
            })
            .sort(d3.ascending),
          0.5
        );
        var q3 = d3.quantile(
          d
            .map(function (g) {
              return g.score;
            })
            .sort(d3.ascending),
          0.75
        );
        var interQuantileRange = q3 - q1;
        var min = q1 - 1.5 * interQuantileRange;
        var max = q3 + 1.5 * interQuantileRange;
        return {
          q1: q1,
          median: median,
          patient: patientData,
          q3: q3,
          interQuantileRange: interQuantileRange,
          min: min,
          max: max,
        };
      })
      .entries(dataset);

    // Show the X scale
    var x = d3
      .scaleBand()
      .range([0, width])
      .domain(["preOp", "6months"])
      .paddingInner(10.2)
      .paddingOuter(0.52);

    // Show the Y scale
    var y = d3.scaleLinear().domain([0, 1]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    const createGradient = (select) => {
      const gradient = select
        .select("defs")
        .append("linearGradient")
        .attr("id", "gradient" + keyTab) 
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "0%")
        .attr("y2", "35%");

      gradient
        .append("stop")
        .attr("offset", "35%")
        .attr("style", "stop-color:#2CB7EA;stop-opacity:1");

      gradient
        .append("stop")
        .attr("offset", "65%")
        .attr("style", "stop-color:#A9B0B1;stop-opacity:1");

      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("style", "stop-color:#C02026;stop-opacity:1");
    };

    svg.append("defs");
    svg.call(createGradient);

    // Show the main vertical line
    svg
      .selectAll("vertLines")
      .data(sumstatBox)
      .enter()
      .append("line")
      .attr("x1", function (d) {
        return x(d.key);
      })
      .attr("x2", function (d) {
        return x(d.key);
      })
      .attr("y1", function (d) {
        return y(d.value.min);
      })
      .attr("y2", function (d) {
        return y(d.value.max);
      })
      .attr("stroke", "#A4A5A5")
      .style("width", 10);

    // rectangle for the main box
    var boxWidth = 20;
    svg
      .selectAll("boxes")
      .data(sumstatBox)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.key) - boxWidth / 2;
      })
      .attr("y", function (d) {
        return y(d.value.q3);
      })
      .attr("height", function (d) {
        return y(d.value.q1) - y(d.value.q3);
      })
      .attr("width", boxWidth)
      .attr("stroke", "white")
      .style("fill", `url(#gradient${keyTab})`);

    // Show the median
    svg
      .selectAll("medianLines")
      .data(sumstatBox)
      .enter()
      .append("line")
      .attr("x1", function (d) {
        return x(d.key) - boxWidth / 2;
      })
      .attr("x2", function (d) {
        return x(d.key) + boxWidth / 2;
      })
      .attr("y1", function (d) {
        return y(d.value.median);
      })
      .attr("y2", function (d) {
        return y(d.value.median);
      })
      .attr("stroke", "#ccef33")
      .style("width", 20);

    // Draw the whiskers at the min for this series
    svg
      .selectAll("indPoints")
      .data(sumstatBox)
      .enter()
      .append("line")
      .attr("x1", function (d) {
        return x(d.key) - boxWidth / 2;
      })
      .attr("x2", function (d) {
        return x(d.key) + boxWidth / 2;
      })
      .attr("y1", function (d) {
        return y(d.value.patient.scoreCPreOp);
      })
      .attr("y2", function (d) {
        return y(d.value.patient.scoreCPreOp);
      })
      .attr("stroke", "#000")
      .attr("class", "lineP")
      .attr("stroke-width", 1)
      .attr("fill", "none");
    svg
      .selectAll("indPoints")
      .data(sumstatBox)
      .enter()
      .append("line")
      .attr("x1", function (d) {
        return x(d.key) - boxWidth / 2;
      })
      .attr("x2", function (d) {
        return x(d.key) + boxWidth / 2;
      })
      .attr("y1", function (d) {
        return y(d.value.patient.predictionC_6M);
      })
      .attr("y2", function (d) {
        return y(d.value.patient.predictionC_6M);
      })
      .attr("stroke", "#000")
      .attr("class", "line6")
      .attr("stroke-width", 1)
      .attr("fill", "none");
  }, [patientData, dataset]);

  return (
    <div className="row">
      <h4>Violinplot</h4>
      <h5>Comparison of pre-operation and 6-month post-operation situation</h5>
      <div>
        <p>
          On the left, the patient's preoperative condition is shown, while on
          the right, their condition six months after surgery is displayed. The
          goal is to compare the current patient's progress with that of others
          using a gradient-filled box plot.
        </p>
        <div className="d-flex flex-row">
          <svg ref={violinRef} className="violinPlot1 mx-5 mt-5"></svg>
          <div className="col-lg-3 col-md-4 col-12">
            <p className="mb-1">Legend:</p>
            <p className="mb-0 fs-6 mig position-relative">Improved</p>
            <p className="mb-0 fs-6 stab position-relative">Uncertain</p>
            <p className="mb-0 peg position-relative">Worsened</p>
            <p className="mb-0 fs-6 dens position-relative">Density of value</p>
            <p className="mb-0 fs-6 pred position-relative">Prediction</p>
            <p className="mb-0 media position-relative">Median</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Violinplot;
