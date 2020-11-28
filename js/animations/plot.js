import { HEALTHY_COLOR, INFECTED_COLOR, IMMUNE_COLOR } from "../settings.js";
import { countHistory } from "../people/people.js";


var infectedTrace = {
  y: countHistory.infected,
  name: "Infected people",
  mode: "none",
  fillcolor: INFECTED_COLOR,
  stackgroup: "one"
}

var immuneTrace = {
  y: countHistory.immune,
  name: "Immune people",
  mode: "none",
  fillcolor: IMMUNE_COLOR,
  stackgroup: "one"
}

var healthyTrace = {
  y: countHistory.healthy,
  name: "Healthy people",
  mode: "none",
  fillcolor: HEALTHY_COLOR,
  stackgroup: "one"
}

var data = [infectedTrace, immuneTrace, healthyTrace];


var layout = {
  xaxis: {
    rangemode: "tozero",
    showgrid: false
  },
  yaxis: {
    showgrid: false
  },
  showlegend: false,
  height: 180,
  width: 0.6 * window.innerWidth + 90,
  font: {
    family: getComputedStyle(document.body).fontFamily
  },
  margin: {
    l: 45,
    r: 45,
    b: 30,
    t: 30,
    pad: 4
  },
  paper_bgcolor: getComputedStyle(document.body).backgroundColor,
  plot_bgcolor: getComputedStyle(document.body).backgroundColor
}


var config = {
  displaylogo: false
}


Plotly.newPlot("plot", data, layout, config);


export function update() {
  Plotly.relayout(plot, layout);
}

export function center() {
  document.getElementsByClassName("user-select-none")[0].style.margin = "auto";
}