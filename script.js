// Define your color variables
var backgroundColor = selectColor("gray"); // Black
var textColor = selectColor("violet"); // White



function darkMode(backgroundColor, textColor) {
    document.addEventListener('DOMContentLoaded', (event) => {
      console.log('DOM fully loaded and parsed');
      // Your code here
    });

    // Create a new style element
    var style = document.createElement('style');
    style.type = 'text/css';

    // Use template literals with variables for CSS
    style.innerHTML = `
  body {
    background-color: ${backgroundColor} !important; /* Dynamic background color */
    color: ${textColor} !important; /* Dynamic text color */
  }
  /* Include other elements as necessary */
  a, p, div, span, input, button, select, textarea {
    color: ${textColor} !important; /* Dynamic text color */
    background-color: ${backgroundColor} !important; /* Dynamic background color */
  }
  /* etc... */
`;

    // Append the style element to the head
    document.head.appendChild(style);

}
function selectColor(color) {
    var col = '#fff';
    switch (color) {
        case "black":
            col = '#000';
            break;
        case "white":
            col = '#FFF';
            break;
        case "gray":
            col = '#9B9B9B';
            break;
        case "orange":
            col = '#F5A623';
            break;
        case "yellow":
            col = '#E6CB0A';
            break;
        case "green":
            col = '#37d67a';
            break;
        case "blue":
            col = '#2CCCE4';
            break;
        case "purple":
            col = '#ba68c8';
            break;
        case "red":
            col = '#f47373';
            break;
        case "pink":
            col = '#E62265';
            break;
        case "violet":
            col = '#6C2270';
            break;
    }
    return col;
}

// Initial application of dark mode
darkMode(backgroundColor, textColor);

// Observer to reapply dark mode when DOM changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      darkMode(backgroundColor, textColor);
    }
  });
});

// Start observing the body for configured mutations
observer.observe(document.body, {
  childList: true, // observe direct children
  subtree: true, // and lower descendants too
  attributes: false // set to true if you also want to observe attribute changes
});

// Optional: Disconnect the observer if you no longer need it
// observer.disconnect();

