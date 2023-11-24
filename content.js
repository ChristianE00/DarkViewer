/******************************************************** */
//Author :         Christian Ewing
//Created On :     11/07/23
// Last Modified : 11/23/2023 
// Copyright :     
// Description :   Modifies views between dark theme and default view theme
/******************************************************** */

console.log("entered");
/*
* FUNCTION:  
* Revert other element styles as needed
* Apply Dark Mode on page load if activated
*
*
*/

chrome.storage.local.get('darkMode', function (data) {
    if (data.darkMode) {
        applyDarkModeStyles();
    }
});


/*
* FUNCTION: Listen for the message from popup.js
*
*
*/

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.command === "toggle-dark") {
        toggleDarkMode();
    }
});



/*
* FUNCTION
*
*
*/
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode-enabled');
    // Save the state in chrome.storage.local
    chrome.storage.local.set({ darkMode: isDarkMode }, function () {
        //console.log('Dark Mode state is set to ' + isDarkMode);
    });
    applyOrRemoveStyles(isDarkMode);
}


/*
* FUNCTION
*
*
*/
function applyOrRemoveStyles(isDarkMode) {
    isDarkMode ? applyDarkModeStyles() : removeDarkModeStyles();
}


/*
* FUNCTION
*
*
*/
// Function to apply styles to an individual element
function applyStylesToElement(element) {
    // Check and apply styles for divs
    if (element.tagName === 'DIV') {
        let currentBgColor = window.getComputedStyle(element).backgroundColor;
        if (!isDarkColor(currentBgColor)) {
            element.style.backgroundColor = "#333333";
            element.style.color = "#FFFFFF";
        }
    }

    // Check and apply styles for spans
    if (element.tagName === 'SPAN') {
        element.style.color = '#FFFFFF'; // Set color to white
    }

    // Check and apply styles for headings and paragraphs
    if (element.matches('h1, h2, h3, h4, h5, h6, p, li, b')) {
        element.style.setProperty('color', '#FFFFFF', 'important');
    }

    // Check and apply styles for links
    if (element.tagName === 'A') {
        element.style.setProperty('color', '#BB86FC', 'important');
    }

    // Check and apply styles for buttons
    if (element.tagName === 'BUTTON') {
        let currentBgColor = window.getComputedStyle(element).backgroundColor;
        if (!isDarkColor(currentBgColor)) {
            element.style.backgroundColor = "#333333";
            element.style.color = "#FFFFFF";
        }
    }

    // Check and apply styles for text inputs and textareas
    if (element.matches('input[type="text"], input[type="password"], input[type="email"], textarea')) {
        element.style.color = '#6bf0fa'; // Light blue color
    }

    // Apply styles to child elements
    //element.querySelectorAll('div, span, h1, h2, h3, h4, h5, h6, p, a, button, input[type="text"], input[type="password"], input[type="email"], textarea').forEach(applyStylesToElement);
}


/*
* FUNCTION
* callback
*
*/
function mutationCallback(mutations) {
    for (let mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
            mutation.addedNodes.forEach(node => {
                console.log("forLoop");
                if (node.nodeType === Node.ELEMENT_NODE) {
                    console.log("success");
                    applyStylesToElement(node);
                    //toggleDarkMode();
                    node.querySelectorAll('*').forEach(applyStylesToElement);
                }
            });
        }
    }
}


/*
* FUNCTION
* Set up and start the MutationObserver
*
*/
function setupMutationObserver() {
    const observer = new MutationObserver(mutationCallback);
    const config = { childList: true, subtree: true };

    // Targeting the 'botstuff' div
    const targetContainer = document.getElementById('botstuff');
    if (targetContainer) {
        console.log("botstuff found");
        observer.observe(targetContainer, config);
    } else {
        console.log("Target container 'botstuff' not found.");
    }

    return observer;
}


let observer;


/*
* FUNCTION
*
*
*/
function applyDarkModeStyles() {
    // Set background and text colors for the body
    if (!isDarkColor(window.getComputedStyle(document.body).backgroundColor)) {
        document.body.style.backgroundColor = "#121212";
        document.body.style.color = "#FFFFFF";
    }

    // Apply styles to existing elements on the page
    document.querySelectorAll('div, span, h1, h2, h3, h4, h5, h6, p, a, button, input[type="text"], input[type="password"], input[type="email"], textarea').forEach(applyStylesToElement);
    
    // Setup MutationObserver if not already set up
    if (!observer) {
        observer = setupMutationObserver();
    }
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

    const spans = document.querySelectorAll('span');
    spans.forEach(span => span.style.color = null);

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
    headings.forEach(heading => heading.style.color = null);

    const links = document.getElementsByTagName('a');
    for (const link of links) {
        link.style.color = null;
    }

    const buttons = document.getElementsByTagName('button');
    for (const button of buttons) {
        button.style.backgroundColor = null;
        button.style.color = null;
    }

    const textInputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], textarea');
    textInputs.forEach(input => input.style.color = null);
    if (observer) {
        observer.disconnect();
        observer = null;
    }

}


/*
* FUNCTION
*
*
*/
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
