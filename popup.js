/******************************************************** */
// Author :         Christian Ewing
// Created On :     11/07/23
// Last Modified :  11/23/2023 
// Copyright :     
// Description :    Modifies views between dark theme and default view theme
/******************************************************** */


// This function sends a message to the active tab to toggle dark mode
/**function toggleDarkMode() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "toggle-dark"});
    });
}
**/

function toggleDarkMode() {
    var querying = chrome.tabs.query || browser.tabs.query;
    var messaging = chrome.tabs.sendMessage || browser.tabs.sendMessage;

    querying({active: true, currentWindow: true}, function(tabs) {
        messaging(tabs[0].id, {command: "toggle-dark"});
    });
}

// Add an event listener to your button in the popup
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

    var toggleButton = document.getElementById('toggle-dark-mode');
    toggleButton.addEventListener('click', function() {
        toggleDarkMode();
        console.log('Toggle button clicked');
    });
});
