/******************************************************** */
// Author :         Christian Ewing
// Created On :     11/07/23
// Last Modified :  11/27/2023 
// Copyright :     
// Description :    Modifies views between dark theme and default view theme
/******************************************************** */

/*
* FUNCTION:  
* Revert other element styles as needed
* Apply Dark Mode on page load if activated
*
*
*/
let isDarkModeActive = false;
chrome.storage.local.get('darkMode', function (data) {
    if (data.darkMode) {
        isDarkModeActive = true;
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
    isDarkModeActive = !isDarkModeActive;
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

function isWhiteOrBlack(color) {
    // Checking if the color is white or black
    //var white = 'rgb(255, 255, 255)';
    var black = 'rgb(0, 0, 0)';
    return color === white || color === black;
}


/*
* FUNCTION: 
* NOTE: `backgroundColor = ""` and `backgroundColor = null` are usually treated the same between browsers, but in some
* cases "" and null might be handled differently between browsers. 
* 
* So, in many cases null and "" will behave similarly, using null is often considered better practice for removing inline 
* styles because it's more explicit and clear about the intent. It also ensures a more consistent behavior across different 
* browsers and scenarios.
*/
function removeDarkModeStyles() {
    toggleInvertIframe();
    // Remove styles and revert to the original state
    //addCSS();
    document.body.style.backgroundColor = null;
    document.body.style.color = null;

    const pres = document.getElementsByTagName('pre');
    for (const pre of pres) {
        pre.style.backgroundColor = null;
        pre.style.color = null;
    }

    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
        if (iframe.contentWindow) {
            toggleInvertIframe(iframe);
        }
    }

    const containerClasss = document.getElementsByClassName('containerClass');
    for (const containerClass of containerClasss) {
        containerClass.style.backgroundColor = null;
        containerClass.style.color = null;
    }
    const divs = document.getElementsByTagName('div');
    for (const div of divs) {
        div.style.backgroundColor = null;
        div.style.color = null;
    }
    const codes = document.getElementsByTagName('code');
    for (const code of codes) {
        code.style.backgroundColor = null;
        code.style.color = null;
    }

    const spans = document.querySelectorAll('span');
    spans.forEach(span => span.style.color = null);

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, b, td, li');
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

    const textInputs = document.querySelectorAll('input[type="text"], input[type="password"], input[type="email"], textarea, iframe');
    textInputs.forEach(input => input.style.color = null);
    if (observer) {
        observer.disconnect();
        observer = null;
    }

}




/*
* FUNCTION
*  NOTE: element.tagName vs element.matches
*  
*  element.matches: Checks if the element would be selected by the specified CSS selector string. It returns true if the 
*       element matches the selector and false otherwise. Used when you need to check if an element matches complex selectors 
*       or when the same function needs to handle a variety of elements selected by different criteria.
*  
*   element.tagName:  Returns the name of the tag for the element, in uppercase. It only provides the tag name, so it's less 
*       flexible compared to matches(). It doesn't consider class names, IDs, or other attributes. Used when you only need 
*       to check the type of element (e.g., DIV, SPAN) without regard to other attributes like classes or IDs.
*
*/
// Function to apply styles to an individual element
function applyStylesToElement(element) {
    if (element.matches('pre')) {
        console.log('entered code block');
        element.style.color = '#FFFFFF'; // White text color
        element.style.backgroundColor = '#000000'; // Black background color
    }
    if (element.matches('code')) {
        // console.log('entered code block');
        //element.style.color.filter = 'invert(100%)';
        element.style.backgroundColor = '#333333'; // grey color
       // if (isWhiteOrBlack) {
            element.style.color = '#f44336'; // Example: changing to white
        //}
        //element.style.filter = 'invert(100%)';
    }
    if (element.matches('iframe')) {
        toggleInvertIframe(element);
    }
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

    // Check and apply styles for a specific container
    /* if (element.classList.contains('containerClass')) {
         element.style.backgroundColor = "#333333"; // Example background color
         element.style.color = "#FFFFFF"; // Example text color
     }
 */
    // Check and apply styles for headings, paragraphs, table cells, and list items.
    if (element.matches('h1, h2, h3, h4, h5, h6, p, li, b, td, li')) {
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
    //element.querySelectorAll('div, span, h1, h2, h3, h4, h5, h6, p, a, button, input[type="text"], input[type="password"], input[type="email"], textarea, .containerClass').forEach(applyStylesToElement);
}



/*
* FUNCTION: 
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
    document.querySelectorAll('div, span, h1, h2, h3, h4, h5, h6, p, a, button, td, li, input[type="text"], input[type="password"], input[type="email"], textarea, containerClass, iframe, code, pre').forEach(applyStylesToElement);

    // Setup MutationObserver if not already set up
    if (!observer) {
        observer = setupMutationObserver();
    }
}





/*
* FUNCTION
* callback
*
*/
function mutationCallback(mutations) {
    if (!isDarkModeActive) {
        return false
    }

    for (let mutation of mutations) {
        console.log(document.body.classList.toggle('dark-mode-enabled'));
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    applyStylesToElement(node);
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




function toggleInvertIframe(iframe) {
    //var iframe = document.querySelector('iframe'); // Adjust the selector as needed
    if (iframe && iframe.style) {
        if (iframe.style.filter === 'invert(100%)') {
            console.log('invert(100%)');
            iframe.style.filter = null; // Remove the filter
        } else {
            console.log('NOT invert(100%)');
            iframe.style.filter = 'invert(100%)'; // Apply the filter
        }
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
