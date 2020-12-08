import * as settings from "./settings.js";
import { people, count, countHistory, move as movePeople, checkStateChange as checkPeopleStateChange } from "./people/people.js";
import { draw, clear as clearCanvas, resize as resizeCanvas } from "./animations/canvas.js";
import * as chart from "./animations/chart.js";


var isPlaying = false;
export var frameCount = 0;
var nextFrameID;


document.addEventListener("DOMContentLoaded", function() {
  resizeCanvas();

  settings.resetSettings();

  countHistory.setInitialCount();

  chart.create("people");

  addEventListeners();
});


function play() {
  frameCount++;

  checkPeopleStateChange();

  movePeople();
  clearCanvas();
  draw(people);

  settings.setPeopleCountInputs();

  if (frameCount % settings.MONITOR_REFRESH_RATE === 0) {
    countHistory.addCurrentCount();
    chart.update();
    count.reset();
  }

  nextFrameID = window.requestAnimationFrame(play);
}


function togglePlayPause() {
  if (isPlaying) {
    playPauseButton.innerHTML = "Play";
    window.cancelAnimationFrame(nextFrameID);
    isPlaying = false;
  }
  else {
    playPauseButton.innerHTML = "Pause";
    nextFrameID = window.requestAnimationFrame(play);
    isPlaying = true;
  }
}




function addEventListeners() {
  for (let element of document.getElementsByClassName("people-count-input")) {
    element.addEventListener("change", function() {
      settings.setPeopleCounts({ target: element });
      if (frameCount === 0) {
        countHistory.setInitialCount();
        updateChart();
      }
    });
  }

  for (let element of document.getElementsByClassName("people-count-button minus")) {
    let input = document.getElementById(element.id.slice(0, -2));
    element.addEventListener("click", function() {
      input.value--;
      settings.setPeopleCounts({ target: input });
      if (frameCount === 0) {
        countHistory.setInitialCount();
        updateChart();
      }
    });
  }

  for (let element of document.getElementsByClassName("people-count-button plus")) {
    let input = document.getElementById(element.id.slice(0, -2));
    element.addEventListener("click", function() {
      input.value++;
      settings.setPeopleCounts({ target: input });
      if (frameCount === 0) {
        countHistory.setInitialCount();
        updateChart();
      }
    });
  }


  speedSlider.addEventListener("input", function() {
    speedInput.value = this.value;
  });
  speedInput.addEventListener("input", function() {
    speedSlider.value = this.value;
  });
  speedInput.addEventListener("change", settings.setInitialSpeeds);
  speedSlider.addEventListener("change", settings.setInitialSpeeds);

  radiusSlider.addEventListener("input", function() {
    radiusInput.value = this.value;
  });
  radiusInput.addEventListener("input", function() {
    radiusSlider.value = this.value;
  });
  radiusInput.addEventListener("change", function() {
    settings.setInitialRadiuses();
    clearCanvas();
    draw(people);
  });
  radiusSlider.addEventListener("change", function() {
    settings.setInitialRadiuses();
    clearCanvas();
    draw(people);
  });


  for (let element of document.getElementsByClassName("person-time-input")) {
    element.addEventListener("change", settings.setTimes);
  }

  for (let element of document.getElementsByClassName("person-time-button minus")) {
    let input = document.getElementById(element.id.slice(0, -2));
    element.addEventListener("click", function() {
      input.value--;
      settings.setTimes({ target: input });
    });
  }

  for (let element of document.getElementsByClassName("person-time-button plus")) {
    let input = document.getElementById(element.id.slice(0, -2));
    element.addEventListener("click", function() {
      input.value++;
      settings.setTimes({ target: input });
    });
  }

  chartSelect.addEventListener("change", function() {
    chart.change(chartSelect.value);
  });

  playPauseButton.addEventListener("click", togglePlayPause);
}