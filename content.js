/******************************************************** */
//Author :         Christian Ewing
//Created On :     11/07/23
// Last Modified : 11/23/2023 
// Copyright :     
// Description :   Modifies views between dark theme and default view theme
/******************************************************** */



console.log("Script started");
// Apply Dark Mode on page load if activated
chrome.storage.local.get('darkMode', function(data) {
    if (data.darkMode) {
        applyDarkModeStyles();
    }
});

// ... rest of the content.js script ...


function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode-enabled');
    // Save the state in chrome.storage.local
    chrome.storage.local.set({darkMode: isDarkMode}, function() {
        console.log('Dark Mode state is set to ' + isDarkMode);
    });
    applyOrRemoveStyles(isDarkMode);
}

function applyOrRemoveStyles(isDarkMode) {
    if (isDarkMode) {
        applyDarkModeStyles();
    } else {
        removeDarkModeStyles();
    }
}


function applyDarkModeStyles() {
    console.log("applyDarkMode");
    // Set background and text colors
    document.body.style.backgroundColor = "#121212";
    document.body.style.color = "#FFFFFF";

    // Modify other elements like links, buttons, etc.
    const links = document.getElementsByTagName('a');
    for (const link of links) {
        link.style.color = "#BB86FC"; // Example: Purple color for links
    }

    const buttons = document.getElementsByTagName('button');
    for (const button of buttons) {
        button.style.backgroundColor = "#333333";
        button.style.color = "#FFFFFF";
    }

    // Add other element styles as needed
}

function removeDarkModeStyles() {
    console.log("removeDarkMode");
    // Remove styles and revert to the original state
    document.body.style.backgroundColor = "#FFFFFF";
    document.body.style.color = "#121212";

    const links = document.getElementsByTagName('a');
    for (const link of links) {
        link.style.color = "#0000EE"; // Revert link colors
    }

    const buttons = document.getElementsByTagName('button');
    for (const button of buttons) {
        button.style.backgroundColor = "#FFFFFF";
        button.style.color = "#333333";
    }

    // Revert other element styles as needed
}

// Listen for the message from popup.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("request found");
    if(request.command === "toggle-dark") {
        toggleDarkMode();
    }
});
