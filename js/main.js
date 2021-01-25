import * as settings from "./settings.js";
import * as people from "./people/people.js";
import * as walls from "./walls/walls.js";
import { drawPeople, clearPeople, resize as resizeCanvas, offsetLeft, offsetTop } from "./animations/canvas.js";
import * as chart from "./animations/chart.js";


var isPlaying = false;
export var frameCount = 0;
var nextFrameID;

let mouseX = 0;
let mouseY = 0;
export let mouseIsDown = false;
let onMouseMove = people.checkMouseHover;


document.addEventListener("DOMContentLoaded", function() {
  resizeCanvas();

  settings.resetSettings();

  people.countHistory.setInitialCount();

  chart.create("people");

  addEventListeners();
});


function play() {
  frameCount++;

  people.checkStateChange();

  if (!settings.speedIsZero) {
    people.move();
    people.collide();
    people.checkMouseHover(mouseX, mouseY);
  }

  clearPeople();
  drawPeople(people.people);

  settings.setPeopleCountInputs();

  if (frameCount % settings.MONITOR_REFRESH_RATE === 0) {
    people.countHistory.addCurrentCount();
    chart.update();
    people.count.reset();
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
        people.countHistory.setInitialCount();
        chart.update();
      }
    });
  }

  for (let element of document.getElementsByClassName("people-count-button minus")) {
    let input = document.getElementById(element.id.slice(0, -2));
    element.addEventListener("click", function() {
      input.value--;
      settings.setPeopleCounts({ target: input });
      if (frameCount === 0) {
        people.countHistory.setInitialCount();
        chart.update();
      }
    });
  }

  for (let element of document.getElementsByClassName("people-count-button plus")) {
    let input = document.getElementById(element.id.slice(0, -2));
    element.addEventListener("click", function() {
      input.value++;
      settings.setPeopleCounts({ target: input });
      if (frameCount === 0) {
        people.countHistory.setInitialCount();
        chart.update();
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
    clearPeople();
    drawPeople(people.people);
  });
  radiusSlider.addEventListener("change", function() {
    settings.setInitialRadiuses();
    clearPeople();
    drawPeople(people.people);
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

  selectButton.addEventListener("click", function() {
    onMouseMove = people.checkMouseHover;
  });

  placeWallButton.addEventListener("click", function() {
    onMouseMove = walls.editWall;
  });

  removeWallButton.addEventListener("click", function() {
    onMouseMove = walls.checkMouseHover;
  });

  touchBox.addEventListener("mouseenter", function(event) {
    mouseX = event.clientX - offsetLeft;
    mouseY = event.clientY - offsetTop;
    if (onMouseMove === walls.editWall) {
      walls.newWall(mouseX, mouseY, settings.wallThickness);
    }
  });

  touchBox.addEventListener("mouseleave", function() {
    if (onMouseMove === people.checkMouseHover) {
      people.unhoverPeople();
    }
    else if (onMouseMove === walls.editWall) {
      walls.deleteWallInConstruction();
    }
  });

  touchBox.addEventListener("mousemove", function(event) {
    mouseX = event.clientX - offsetLeft;
    mouseY = event.clientY - offsetTop;
    onMouseMove(mouseX, mouseY);
  });

  touchBox.addEventListener("click", function() {
    if (onMouseMove === walls.checkMouseHover) {
      walls.removeWall();
    }
  });

  touchBox.addEventListener("mousedown", function() {
    mouseIsDown = true;
  });

  touchBox.addEventListener("mouseup", function(event) {
    mouseX = event.clientX - offsetLeft;
    mouseY = event.clientY - offsetTop;
    if (mouseIsDown && onMouseMove === walls.editWall) {
      walls.placeWall();
      walls.newWall(mouseX, mouseY, settings.wallThickness);
    }
  });

  document.addEventListener("mouseup", function() {
    mouseIsDown = false;
  });

  chartSelect.addEventListener("change", function() {
    chart.change(chartSelect.value);
  });

  playPauseButton.addEventListener("click", togglePlayPause);
}