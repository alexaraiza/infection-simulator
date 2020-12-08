import { HEALTHY_COLOR, INFECTED_COLOR, IMMUNE_COLOR } from "../settings.js";
import { countHistory } from "../people/people.js";


const chartElement = document.getElementById("chart");
let chart;


Chart.defaults.global.animation.duration = 0;
Chart.defaults.global.defaultFontFamily = getComputedStyle(document.body).fontFamily;
Chart.defaults.global.defaultFontColor = getComputedStyle(document.body).color;
Chart.defaults.global.elements.line.tension = 0;
Chart.defaults.global.elements.point.radius = 0;
Chart.defaults.global.elements.point.hoverRadius = 5;
Chart.defaults.global.elements.point.hitRadius = 20;
Chart.defaults.global.layout.padding = {
  left: 2,
  right: 24,
  top: 0,
  bottom: 3
};
Chart.defaults.global.maintainAspectRatio = false;
Chart.defaults.global.tooltips.callbacks.title = function(tooltipItem) {
  let dayCount = tooltipItem[0].xLabel;
  if (dayCount === 1) return dayCount + " day";
  return dayCount + " days";
};
Chart.defaults.global.tooltips.mode = "index";
Chart.defaults.global.tooltips.position = "nearest";


const OPACITY = "bf";


let healthyDataset = {
  label: "Healthy people",
  backgroundColor: HEALTHY_COLOR + OPACITY,
  borderColor: HEALTHY_COLOR + OPACITY,
  pointBackgroundColor: HEALTHY_COLOR,
  fill: false,
  data: countHistory.healthy
}

let infectedDataset = {
  label: "Infected people",
  backgroundColor: INFECTED_COLOR + OPACITY,
  borderColor: INFECTED_COLOR + OPACITY,
  pointBackgroundColor: INFECTED_COLOR,
  fill: false,
  data: countHistory.infected
}

let immuneDataset = {
  label: "Immune people",
  backgroundColor: IMMUNE_COLOR + OPACITY,
  borderColor: IMMUNE_COLOR + OPACITY,
  pointBackgroundColor: IMMUNE_COLOR,
  fill: false,
  data: countHistory.immune
}

const PEOPLE_CHART = {
  type: "line",

  data: {
    labels: countHistory.days,
    datasets: [healthyDataset, infectedDataset, immuneDataset]
  },

  options: {
    scales: {
      xAxes: [{
        gridLines: {
          tickMarkLength: 5
        },
        scaleLabel: {
          display: true,
          labelString: "Days elapsed"
        },
        ticks: {
          beginAtZero: true,
          maxRotation: 0
        }
      }],
      
      yAxes: [{
        gridLines: {
          tickMarkLength: 5
        },
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
}


let collisionsDataset = {
  label: "Collisions",
  backgroundColor: "#bfbfbf" + OPACITY,
  data: countHistory.dailyCollisions
}

let infectionsDataset = {
  label: "Infections",
  backgroundColor: INFECTED_COLOR + OPACITY,
  data: countHistory.dailyInfections
}

const DAILY_INTERACTIONS_CHART = {
  type: "bar",

  data: {
    labels: countHistory.days,
    datasets: [collisionsDataset, infectionsDataset]
  },

  options: {
    scales: {
      xAxes: [{
        gridLines: {
          offsetGridLines: false,
          tickMarkLength: 5
        },
        offset: false,
        scaleLabel: {
          display: true,
          labelString: "Days elapsed"
        },
        ticks: {
          beginAtZero: true,
          maxRotation: 0
        }
      }],
      
      yAxes: [{
        gridLines: {
          tickMarkLength: 5
        },
        ticks: {
          beginAtZero: true
        }
      }]
    },

    tooltips: {
      callbacks: {
        title: function(tooltipItem) {
          return "Day " + (tooltipItem[0].xLabel + 1);
        }
      }
    }
  },

  plugins: {
    afterUpdate: function(chart) {
      let chartLimits = chart.chartArea;
      let offset = 0.5 * (chartLimits.right - chartLimits.left) / (chart.data.labels.length - 1);

      for (let dataset of chart.config.data.datasets) {
        for (let data of dataset._meta[chart.id].data) {
          data._model.x += offset;
        }
      }
    }
  }
}




const CHARTS = {
  "people": PEOPLE_CHART,
  "dailyInteractions": DAILY_INTERACTIONS_CHART
}


export function create(type) {
  chart = new Chart(chartElement, CHARTS[type]);
}


export function change(type) {
  chart.destroy();
  chart = new Chart(chartElement, CHARTS[type]);
}


export function update() {
  chart.update();
}