const PAGES = [
    {
        title: "Welcome to infection simulator!",
        body: "<p>This app simulates the spread of an infectious disease in a small population with healthy, infected and immune people.</p>"
    },
    {
        title: "Inputs",
        body: "<p>You can control the simulation by using the inputs in the toolbar or by pressing <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' class='tutorial__icon'><path d='M19.5,12c0-0.23-0.01-0.45-0.03-0.68l1.86-1.41c0.4-0.3,0.51-0.86,0.26-1.3l-1.87-3.23c-0.25-0.44-0.79-0.62-1.25-0.42 l-2.15,0.91c-0.37-0.26-0.76-0.49-1.17-0.68l-0.29-2.31C14.8,2.38,14.37,2,13.87,2h-3.73C9.63,2,9.2,2.38,9.14,2.88L8.85,5.19 c-0.41,0.19-0.8,0.42-1.17,0.68L5.53,4.96c-0.46-0.2-1-0.02-1.25,0.42L2.41,8.62c-0.25,0.44-0.14,0.99,0.26,1.3l1.86,1.41 C4.51,11.55,4.5,11.77,4.5,12s0.01,0.45,0.03,0.68l-1.86,1.41c-0.4,0.3-0.51,0.86-0.26,1.3l1.87,3.23c0.25,0.44,0.79,0.62,1.25,0.42 l2.15-0.91c0.37,0.26,0.76,0.49,1.17,0.68l0.29,2.31C9.2,21.62,9.63,22,10.13,22h3.73c0.5,0,0.93-0.38,0.99-0.88l0.29-2.31 c0.41-0.19,0.8-0.42,1.17-0.68l2.15,0.91c0.46,0.2,1,0.02,1.25-0.42l1.87-3.23c0.25-0.44,0.14-0.99-0.26-1.3l-1.86-1.41 C19.49,12.45,19.5,12.23,19.5,12z M12.04,15.5c-1.93,0-3.5-1.57-3.5-3.5s1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5S13.97,15.5,12.04,15.5z'/></svg> on your mobile device.</p>"
    },
    {
        title: "People",
        body: "<p>You can control how many people are in the simulation at any given time.</p><p>The infection and death rates indicate the probability that a person becomes infected after coming in contact with another infected person or dies after being infected, respectively.</p><p>The amount of time a person is infected or immune is indicated by the number of infected or immune days, each simulation day lasting around one second.</p><p>You can also control how fast and how big the people are.</p>"
    },
    {
        title: "Simulation",
        body: "<p>The RESET button resets the simulation and resizes the window if necessary.</p><p>The PLAY/PAUSE button starts and stops the simulation.</p>"
    },
    {
        title: "Extras",
        body: "<p>You can remove specific people by clicking <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' class='tutorial__icon'><path d='M8.65,5.82C9.36,4.72,10.6,4,12,4c2.21,0,4,1.79,4,4c0,1.4-0.72,2.64-1.82,3.35L8.65,5.82z M20,17.17 c-0.02-1.1-0.63-2.11-1.61-2.62c-0.54-0.28-1.13-0.54-1.77-0.76L20,17.17z M20.49,20.49L3.51,3.51c-0.39-0.39-1.02-0.39-1.41,0l0,0 c-0.39,0.39-0.39,1.02,0,1.41l8.18,8.18c-1.82,0.23-3.41,0.8-4.7,1.46C4.6,15.08,4,16.11,4,17.22L4,20h13.17l1.9,1.9 c0.39,0.39,1.02,0.39,1.41,0l0,0C20.88,21.51,20.88,20.88,20.49,20.49z'/></svg>, then clicking on the person you want to remove.</p><p>You can add walls by clicking <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' class='tutorial__icon'><path d='M2 4v1h9.5v4H2v1h3v4H2v1h9.5v4H2v1H22V19H12.5V15H22V14H19V10H22V9H12.5V5H22V4ZM6 10H18v4H6Z'/></svg>, then clicking and dragging on the window to make a wall.</p><p>You can remove walls by clicking <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' class='tutorial__icon'><path d='M3 3L1.5 4.5L6 9H2v1h3v4H2v1h9.5v4H2v1H17l3 3l1.5-1.5ZM6 10h1l4 4H6Zm6.5 5.5L16 19H12.5ZM7 4H21v1H12.5v4H21v1H18v4h3v1H18l-1-1v-4H13l-1.5-1.5V5H8Z'/></svg>, then clicking on the wall you want to remove.</p>"
    },
    {
        title: "Have fun!",
        body: "<p>Try changing the input values to see different results!</p><p>Try adding walls to see how different types of confinement can affect the evolution of the disease.</p><p>Have fun simulating!</p>"
    }
]


let currentPage = 0;


export function previousPage() {
    if (currentPage === PAGES.length - 1) {
        nextPageTutorialButton.style.visibility = "";
    }
    if (currentPage > 0) {
        currentPage--;
        updateTutorialHTML();
    }
    if (currentPage === 0) {
        previousPageTutorialButton.style.visibility = "hidden";
    }
}

export function nextPage() {
    if (currentPage === 0) {
        previousPageTutorialButton.style.visibility = "";
    }
    if (currentPage < PAGES.length - 1) {
        currentPage++;
        updateTutorialHTML();
    }
    if (currentPage === PAGES.length - 1) {
        nextPageTutorialButton.style.visibility = "hidden";
    }
}


function updateTutorialHTML() {
    tutorialTitle.innerHTML = PAGES[currentPage].title;
    tutorialBody.innerHTML = PAGES[currentPage].body;
}