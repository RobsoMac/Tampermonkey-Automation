// ==UserScript==
// @name         Service Order Automation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate actions on service orders page
// @author       macrobso
// @match        https://example.com/*
// @match        https://example.com/search?search_type=all&search_string=*
// @downloadURL  https://example.com/downloadURL.js?download=true
// @updateURL    https://example.com/updateURL.js?download=true
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the Serial ID is on the site and take actions if found
    function checkSerialID(serialID, ticketTitle) {
        if (serialID) {
            // Place the comment
            const comment = `
${ticketTitle} inbound received.

BIN name
Serial ID:
${serialID}
            `;

            // Update the button name, assigned group, and assignee based on the ticket title
            let buttonName, assignedGroup, assignee;

            switch (ticketTitle) {
                case 'Cluster':
                    buttonName = 'Cluster Action Button';
                    assignedGroup = 'Cluster Data Tech';
                    assignee = 'Cluster_Number-AZ-PARTS';
                    break;
                // Add more cases for other ticket titles as needed
                default:
                    // Default values if no matching title is found
                    buttonName = 'Default Action Button';
                    assignedGroup = 'Default Group';
                    assignee = 'Default Assignee';
            }

            // Update the button name (you will need to find the appropriate selector)
            document.querySelector('#buttonNameSelector').textContent = buttonName;

            // Update the assigned group (you will need to find the appropriate selector)
            document.querySelector('#assignedGroupSelector').textContent = assignedGroup;

            // Update the assignee (you will need to find the appropriate selector)
            document.querySelector('#assigneeSelector').textContent = assignee;

            // Place the comment and perform other actions as before
            // ...

            // You may need to trigger events if the page relies on event listeners
            // ...
        }
    }

    // Function to fetch the Serial ID and ticket title from the timetable page
    function fetchSerialIDAndTitle() {
        // Replace this with the URL of the timetable webpage
        const timetableURL = 'https://mobility.example.com/part/search';

        // Make an HTTP request to fetch the timetable page content
        fetch(timetableURL)
            .then(response => response.text())
            .then(data => {
                // Parse the HTML content to extract the Serial ID (you will need to inspect the page to find the appropriate selectors)
                const serialIDElement = document.querySelector('#serialIDElementSelector'); // Replace with the actual selector
                const serialID = serialIDElement.textContent.trim();

                // Extract the ticket title (you will need to find the appropriate selector)
                const ticketTitleElement = document.querySelector('#ticketTitleSelector'); // Replace with the actual selector
                const ticketTitle = ticketTitleElement.textContent.trim();

                // Call the function to perform actions with the extracted Serial ID and ticket title
                checkSerialID(serialID, ticketTitle);
            })
            .catch(error => console.error(error));
    }

    // Call the fetchSerialIDAndTitle function when the page loads
    window.addEventListener('load', fetchSerialIDAndTitle);
})();
