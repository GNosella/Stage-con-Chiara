import React from "react";
import boxplot from "../assets/images/boxplot_example.png";
import boxplotexample2 from "../assets/images/boxplot_example_2.png";
import violinplot from "../assets/images/violinplot_example.png";
import circulargraph from "../assets/images/circulargraph_example.png";

function Tutorial() {
  return (
    <section className="container mt-5">
      <div className="row">
        <div>
          <h4 className="primaryColor">The Form</h4>
          <p>
            To collect patient data for the completion form, the doctor relies
            on PROMs (Patient-Reported Outcome Measures), measurements based on
            patient feedback. This feedback is collected through a questionnaire
            that the patient completes before the follow-up visit, where they
            are asked self-assessment questions about their health status,
            focusing on the difficulties encountered in performing daily
            activities after the operation. To better understand the data in the
            form, it is useful to analyze the meaning of the elements in each
            field:
          </p>
          <ul>
            <li>
              <b>ASA Class:</b> The ASA scale is a classification system for the
              physical status of the patient. It was developed to provide
              anesthesiologists and patients with a simple numerical
              categorization of the patient's general condition, which helps to
              predict the surgical risk.
            </li>
            <li>
              <b>Morbidity:</b> Refers to medical problems, complications, or
              undesirable side effects that may arise after surgery or medical
              treatment.
            </li>
            <li>
              <b>ODI:</b> The Oswestry Disability Index (ODI) is a questionnaire
              used to assess disabilities in individuals with both acute and
              chronic low back pain. The scale ranges from 0 (best possible
              health condition) to 100 (worst possible health condition).
            </li>
            <li>
              <b>VAS:</b> The Visual Analogue Scale (VAS) is a measurement tool
              that attempts to quantify a characteristic or attitude that is
              believed to vary along a continuum of values that are difficult to
              measure directly.
            </li>
            <li>
              <b>FABQ Work:</b> The Fear-Avoidance Beliefs Questionnaire (FABQ)
              is a self-report questionnaire that quantifies pain-related fears
              and beliefs about the need to modify behaviors to avoid pain. It
              assesses the association between these beliefs and work and
              physical activity disabilities.
            </li>
            <li>
              <b>SF12 and SF36:</b> The Short-Form Health Survey with 12 and 36
              items is a psychometric questionnaire that describes perceived
              health through two summary indices (physical and mental), very
              useful for quantitative health analyses of specific populations.
              The values of these scales range from 0 (worst possible health
              condition) to 100 (best possible health condition).
            </li>
          </ul>
        </div>

        <div>
          <h4 className="primaryColor mt-4">Boxplot</h4>
          <img className="float-end" src={boxplot} />
          <p>
            This chart evaluates the patient's condition six months after the
            operation, comparing the preoperative physical/mental score with the
            score at six months. The area corresponding to the different health
            states of the patient (uncertain, stable, and improved) is visually
            represented in relation to two coordinates. In this type of chart,
            an increase in the score results in a greater state of uncertainty;
            conversely, improvement occurs with values close to zero.
          </p>
        </div>

        <div className="mt-4">
          <img className="float-start" src={violinplot} />
          <div>
            <h4 className="primaryColor mt-3">Violinplot</h4>
            <p>
              The violin plots allow for comparing two situations: one
              represents the patient's condition before the operation, the other
              illustrates their condition six months after the intervention. In
              this visualization, the patient's data are compared with those of
              other patients, showing the density of values and the median of
              the other patients' conditions. This is overlaid with a box plot,
              with a gradient indicating the state of patients (uncertain,
              stable, and improved) and the prediction of the health status of
              the patient under analysis.
            </p>
          </div>
        </div>

        <div className="my-4">
          <h4 className="primaryColor mt-4">Circulargraph</h4>
          <div className="float-end d-flex flex-column">
            <img style={{ width: "60%" }} src={circulargraph} />
            <img style={{ width: "70%" }} src={boxplotexample2} />
          </div>
          <p>
            To represent the patient's condition six months after the operation,
            a visualization was created characterized by a bar divided into
            three sections (uncertain, stable, and improved) indicating the
            different ranges of possible states, and a bar that shows the
            prediction of the health status of the patient under analysis. This
            visualization allows for evaluating the patient's condition six
            months after the intervention without requiring specific knowledge.
            Using two methods to represent the state six months after the
            operation makes the data understandable to anyone and allows
            determining which of the two methods offers the best results. The
            elements composing the circular visualization include an outer band
            with a gradient that defines the various levels of health status and
            a central colored circle whose coloration varies in relation to the
            health status of the patient under analysis, representing one of the
            colors present in the gradient.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Tutorial;
