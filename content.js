/******************************************************** */
//Author :         Christian Ewing
//Created On :     11/07/23
// Last Modified : 11/23/2023 
// Copyright :     
// Description :   Modifies views between dark theme and default view theme
/******************************************************** */



// Revert other element styles as needed
// Apply Dark Mode on page load if activated
chrome.storage.local.get('darkMode', function (data) {
    if (data.darkMode) {
        applyDarkModeStyles();
    }
});


// Listen for the message from popup.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.command === "toggle-dark") {
        toggleDarkMode();
    }
});

// ... rest of the content.js script ...


function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode-enabled');
    // Save the state in chrome.storage.local
    chrome.storage.local.set({ darkMode: isDarkMode }, function () {
        //console.log('Dark Mode state is set to ' + isDarkMode);
    });
    applyOrRemoveStyles(isDarkMode);
}

function applyOrRemoveStyles(isDarkMode) {
    isDarkMode ? applyDarkModeStyles() : removeDarkModeStyles();
}


function applyDarkModeStyles() {
    // Set background and text colors
    if (!isDarkColor(window.getComputedStyle(document.body).backgroundColor)) {
        document.body.style.backgroundColor = "#121212";
        document.body.style.color = "#FFFFFF";
    }
    //Modify any special divs
    const divs = document.getElementsByTagName('div');
    // Assume divs is a NodeList or array of div elements
    for (const div of divs) {
        let currentBgColor = window.getComputedStyle(div).backgroundColor;
        if (!isDarkColor(currentBgColor)) {
            div.style.backgroundColor = "#333333";
            div.style.color = "#FFFFFF";
        }
    }
    // Modify other elements like links, buttons, etc.
    const links = document.getElementsByTagName('a');
    for (const link of links) {
        link.style.color = "#BB86FC"; // Example: Purple color for links
    }

    const buttons = document.getElementsByTagName('button');
    for (const button of buttons) {
        let currentBgColor = window.getComputedStyle(button).backgroundColor;
        if (!isDarkColor(currentBgColor)) {
            button.style.backgroundColor = "#333333";
            button.style.color = "#FFFFFF";
        }
    }

    // Add other element styles as needed
}

/*NOTE: `backgroundColor = ""` and `backgroundColor = null` are usually treated the same between browsers, but in some
  cases "" and null might be handled differently between browsers. 
  
  So, in many cases null and "" will behave similarly, using null is often considered better practice for removing inline 
  styles because it's more explicit and clear about the intent. It also ensures more consistent behavior across different 
  browsers and scenarios.
*/
function removeDarkModeStyles() {

    // Remove styles and revert to the original state
    document.body.style.backgroundColor = null;
    document.body.style.color = null;

    const divs = document.getElementsByTagName('div');
    for (const div of divs) {
        div.style.backgroundColor = null;
        div.style.color = null;
    }

    const links = document.getElementsByTagName('a');
    for (const link of links) {
        link.style.color = null;
    }

    const buttons = document.getElementsByTagName('button');
    for (const button of buttons) {
        button.style.backgroundColor = null;
        button.style.color = null;
    }


}

function isDarkColor(color) {
    // Convert hex color to RGB
    function hexToRgb(hex) {
        if (!hex) return null;
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    let rgb;

    // Check for RGB or RGBA format
    let rgbMatch = /^rgba?\((\d+), (\d+), (\d+)/.exec(color);
    if (rgbMatch) {
        rgb = { r: parseInt(rgbMatch[1]), g: parseInt(rgbMatch[2]), b: parseInt(rgbMatch[3]) };
    } else {
        // Convert Hex to RGB
        rgb = hexToRgb(color);
    }
    if (!rgb) return false; // Return false if conversion failed
    // Formula for luminance
    let luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
    return luminance < 140; // Threshold of darkness, can be adjusted
}
