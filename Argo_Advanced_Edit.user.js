// ==UserScript==
// @name         Argo_Advanced_Edit
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a button beside Containers to change the state to inactive.
// @author       macrobso@
// @match        https://aws.argo.ocean-wave.aws.a2z.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Wait for the page to fully load before executing
    window.addEventListener('load', function () {

        // Ensure the element with the CSS path exists
        var containerHeader = document.querySelector('<span class="awsui_heading-text_2qdw9_1j43c_264">Container Management</span>');

        if (containerHeader) {
            // Add the "Advanced Edit" button beside "Container Management"
            var advancedEditBtn = document.createElement('input');
            advancedEditBtn.setAttribute('type', 'button');
            advancedEditBtn.setAttribute('value', 'Advanced Edit');
            advancedEditBtn.style.marginLeft = '10px';
            advancedEditBtn.style.padding = '5px';
            advancedEditBtn.style.background = '#4CAF50';
            advancedEditBtn.style.color = 'white';
            advancedEditBtn.style.border = 'none';
            advancedEditBtn.style.borderRadius = '4px';
            containerHeader.after(advancedEditBtn);

            // Create the input pane for changing the state
            var editPane = document.createElement('div');
            editPane.setAttribute('id', 'editPane');
            editPane.style.display = 'none';
            editPane.style.padding = '10px';
            editPane.style.background = '#f4f4f4';
            editPane.style.border = '1px solid #ddd';
            editPane.style.position = 'relative';
            editPane.style.top = '20px';
            advancedEditBtn.after(editPane);

            // Add input field for state change
            var stateInput = document.createElement('input');
            stateInput.setAttribute('id', 'stateInput');
            stateInput.setAttribute('type', 'text');
            stateInput.setAttribute('placeholder', 'Enter container state');
            stateInput.style.width = '200px';
            stateInput.style.padding = '5px';
            stateInput.style.border = '1px solid #ccc';
            stateInput.style.borderRadius = '4px';
            editPane.appendChild(stateInput);

            // Add submit button for editing
            var submitEdit = document.createElement('input');
            submitEdit.setAttribute('id', 'submitEdit');
            submitEdit.setAttribute('type', 'button');
            submitEdit.setAttribute('value', 'Submit Edit');
            submitEdit.style.display = 'block';
            submitEdit.style.marginTop = '10px';
            submitEdit.style.padding = '5px';
            submitEdit.style.background = '#4CAF50';
            submitEdit.style.color = 'white';
            submitEdit.style.border = 'none';
            submitEdit.style.borderRadius = '4px';
            editPane.appendChild(submitEdit);

            // Toggle the edit pane when the "Advanced Edit" button is clicked
            advancedEditBtn.addEventListener('click', function () {
                if (editPane.style.display === 'none') {
                    editPane.style.display = 'block';
                } else {
                    editPane.style.display = 'none';
                }
            });

            // Add an event listener for the Enter key to submit the form
            stateInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    submitEdit.click(); // Simulate a click on the submit button
                }
            });

            // Handle the "Submit Edit" click event
            submitEdit.addEventListener('click', function () {
                var newState = stateInput.value.trim();

                if (newState.toLowerCase() === 'inactive') {
                    // Find the element that contains the state of the containers (adjust this selector based on the actual DOM structure)
                    var containerStateElements = document.querySelectorAll('.container-state-class'); // Replace this with the correct selector

                    containerStateElements.forEach(function (elem) {
                        elem.textContent = 'Inactive'; // Change the state to inactive
                    });

                    alert('Container state changed to inactive.');
                } else {
                    alert('Invalid state. Please enter "inactive".');
                }
            });

        } else {
            console.error('Could not find the container header element.');
        }
    });
})();
