(function() {
    'use strict';

    // Constants for localStorage keys and configuration
    const printerKey = 'brotherPrinterIP';
    const printerModeKey = 'printerMode';
    const themeKey = 'preferredTheme';
    const showPopupKey = 'showPopup';
    const PRINTER_PORT = 9100;

    // Table column indexes
    let serial_index = 0, model_index = 0, modelapn_index = 0, type_index = 0;

    // CSS Variables and Themes
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        :root {
            --bg-color: #ECF2FF;
            --text-color: #2B283A;
            --input-bg: #FFFFFF;
            --input-border: #D1D5DB;
            --switch-bg: #f0f0f0;
            --button-bg: rgb(49, 70, 94);
            --button-hover: rgb(59, 80, 104);
        }
        [data-theme="dark"] {
            --bg-color: #2B283A;
            --text-color: #ECF2FF;
            --input-bg: #374151;
            --input-border: #4B5563;
            --switch-bg: #374151;
            --button-bg: rgb(59, 80, 104);
            --button-hover: rgb(69, 90, 114);
        }
        .printer-settings-box {
            background-color: var(--bg-color);
            color: var(--text-color);
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .printer-input {
            background-color: var(--input-bg);
            color: var(--text-color);
            border: 1px solid var(--input-border);
            padding: 8px;
            border-radius: 4px;
            width: 200px;
        }
        .switch-button {
            width: 120px;
            height: 34px;
            border: none;
            border-radius: 17px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
            line-height: 34px;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(styleElement);

    // Find and store table column indexes
    function getIndexes() {
        let header_row = document.querySelector('table.table.table-bordered.table-striped.table-condensed thead tr').children;
        for (var i = 0; i < header_row.length; i++) {
            if (header_row[i].innerText.toUpperCase() == "SERIAL ID") serial_index = i;
            if (header_row[i].innerText.toUpperCase() == "MODEL") model_index = i;
            if (header_row[i].innerText.toUpperCase() == "MODEL APN") modelapn_index = i;
            if (header_row[i].innerText.toUpperCase() == "TYPE") type_index = i;
        }
        console.log('Column indexes:', { serial_index, model_index, modelapn_index, type_index });
    }

    // Theme management functions
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(themeKey, theme);
    }

    function initTheme() {
        const savedTheme = localStorage.getItem(themeKey);
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(prefersDark ? 'dark' : 'light');
        }
    }

    // Create theme toggle button
    function createThemeToggle() {
        const button = document.createElement('button');
        button.textContent = '🌓';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px;
            border-radius: 50%;
            background: var(--bg-color);
            color: var(--text-color);
            border: 1px solid var(--input-border);
            cursor: pointer;
            font-size: 20px;
            z-index: 1000;
        `;
        button.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
        document.body.appendChild(button);
    }

    // Create IP/USB switch button
    function createIPUSBSwitch() {
        const switchContainer = document.createElement('div');
        switchContainer.style.cssText = 'display: inline-block; margin-right: 15px;';

        const switchButton = document.createElement('button');
        switchButton.className = 'switch-button';
        switchButton.id = 'ip-usb-switch';

        const updateSwitchState = (isIP) => {
            switchButton.style.backgroundColor = isIP ? '#4CAF50' : '#2196F3';
            switchButton.textContent = isIP ? 'IP' : 'USB';
            localStorage.setItem(printerModeKey, isIP ? 'IP' : 'USB');
            
            const inputLabel = document.getElementById('printer-input-label');
            const printerInput = document.getElementById('printer-ip');
            
            if (inputLabel && printerInput) {
                inputLabel.textContent = isIP ? 'IP Address:' : 'Printer Name:';
                printerInput.placeholder = isIP ? 'Enter IP Address' : 'Enter Printer Name';
                
                const savedIP = localStorage.getItem('savedIPAddress') || '';
                const savedUSB = localStorage.getItem('savedUSBName') || '';
                printerInput.value = isIP ? savedIP : savedUSB;
            }
        };

        switchButton.addEventListener('click', () => {
            const isCurrentlyIP = switchButton.textContent === 'IP';
            updateSwitchState(!isCurrentlyIP);
        });

        updateSwitchState(localStorage.getItem(printerModeKey) !== 'USB');
        switchContainer.appendChild(switchButton);
        return switchContainer;
    }

    // Create printer settings input box
    function addPrinterInput() {
        const printerInputBox = document.createElement("div");
        printerInputBox.className = 'printer-settings-box';
        printerInputBox.style.cssText = "display: flex; align-items: center; gap: 15px;";

        const currentMode = localStorage.getItem(printerModeKey) || 'IP';
        const savedValue = currentMode === 'IP' ? 
            localStorage.getItem('savedIPAddress') || '' : 
            localStorage.getItem('savedUSBName') || '';

        const inputContainer = document.createElement('div');
        inputContainer.style.cssText = 'display: flex; align-items: center; gap: 10px;';
        inputContainer.innerHTML = `
            <label id="printer-input-label" style="font-weight: bold;">
                ${currentMode === 'IP' ? 'IP Address:' : 'Printer Name:'}
            </label>
            <input id="printer-ip" class="printer-input" type="text" 
                   placeholder="${currentMode === 'IP' ? 'Enter IP Address' : 'Enter Printer Name'}"
                   value="${savedValue}">
            <button id="save-printer-settings" style="
                background-color: var(--button-bg);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;">Save Settings</button>
        `;

        const ipUsbSwitch = createIPUSBSwitch();
        printerInputBox.appendChild(ipUsbSwitch);
        printerInputBox.appendChild(inputContainer);

        const targetElement = document.querySelector('a[href="https://w.amazon.com/bin/view/DataCenterSystems/Mobility/Project/SMASHSearchAPI/NewGuide/"]');
        if (targetElement) {
            targetElement.insertAdjacentElement('afterend', printerInputBox);
            setupEventListeners();
        }
    }

    // Create print button with all functionality
    function createPrintButton(serialNumber, modelNumber, apnNumber, typeName) {
        const button = document.createElement("button");
        button.innerHTML = "Print 🖨️";
        button.className = 'print-button';
        button.style.cssText = `
            background-color: var(--button-bg);
            color: white;
            border: none;
            height: 36px;
            padding: 4px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            margin: 2px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;

        button.addEventListener("click", async () => {
            const printerIP = localStorage.getItem(printerKey);
            const printerMode = localStorage.getItem(printerModeKey) || "IP";
            
            if (!printerIP) {
                alert("Please set the Printer settings first!");
                return;
            }

            const url = `http://localhost:3000/label?` +
                `IP=${printerIP}` +
                `&FORMAT=${printerMode === 'IP' ? '6' : '2'}` +
                `&SN=${cleanSerialNumber(serialNumber)}` +
                `&MODEL=${modelNumber.trim()}` +
                `&Model_APN=${apnNumber.trim()}` +
                `&TYPE=${typeName.trim()}` +
                `&MODE=${printerMode}`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.status === "success") {
                    showSuccessTick(button);
                } else {
                    alert("Failed to send print job.");
                }
            } catch (error) {
                console.error("Failed to connect to print server:", error);
                showServerDownloadPopup();
            }
        });

        return button;
    }

    // Event listeners setup
    function setupEventListeners() {
        const saveButton = document.getElementById("save-printer-settings");
        const printerInput = document.getElementById("printer-ip");

        if (saveButton) {
            saveButton.addEventListener("click", saveSettings);
        }

        if (printerInput) {
            printerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    saveSettings();
                }
            });
        }
    }

    // Save printer settings to localStorage
    function saveSettings() {
        const printerInput = document.getElementById("printer-ip");
        const currentMode = localStorage.getItem(printerModeKey) || 'IP';
        
        if (printerInput) {
            const inputValue = printerInput.value.trim();
            localStorage.setItem(printerKey, inputValue);
            localStorage.setItem(
                currentMode === 'IP' ? 'savedIPAddress' : 'savedUSBName',
                inputValue
            );
        }

        // Show success indication
        const saveButton = document.getElementById("save-printer-settings");
        if (saveButton) {
            const originalText = saveButton.innerText;
            saveButton.innerText = '✔️ Saved';
            setTimeout(() => {
                saveButton.innerText = originalText;
            }, 1500);
        }
    }

    // Show success indicator on print button
    function showSuccessTick(button) {
        const originalText = button.textContent;
        button.textContent = '✔️';
        setTimeout(() => {
            button.textContent = originalText;
        }, 1000);
    }

    // Clean serial number - removes RMA information
    function cleanSerialNumber(serialNumber) {
        return serialNumber.replace(/\s*\( RMA.*?\)\s*/g, '').trim();
    }

    // Show server download popup
    function showServerDownloadPopup() {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            width: 400px;
            text-align: center;
        `;

        popup.innerHTML = `
            <h2 style="margin-top: 0; color: #31465e;">Print Server Required</h2>
            <p>The local print server is required to use this functionality.</p>
            <div style="margin-top: 20px;">
                <a href="https://drive.corp.amazon.com/documents/macrobso@/print_server.exe" 
                   target="_blank"
                   style="
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 4px;
                    display: inline-block;
                    margin-bottom: 15px;
                   ">Download Print Server</a>
            </div>
            <button onclick="this.parentElement.remove()" 
                    style="
                        background-color: #f44336;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        cursor: pointer;">Close</button>
        `;

        document.body.appendChild(popup);
    }

    // Add print buttons to table rows
    function addPrintButtons() {
        document.querySelectorAll("tbody tr").forEach(row => {
            let targetCell = row.cells[3];
            if (targetCell && !targetCell.querySelector(".print-button")) {
                let serialNumber = row.cells[serial_index]?.innerText.trim() || "Unknown";
                let modelNumber = row.cells[model_index]?.innerText.trim() || "Unknown";
                let apnNumber = row.cells[modelapn_index]?.innerText.trim() || "Unknown";
                let typeName = row.cells[type_index]?.innerText.trim() || "Unknown";

                let printButton = createPrintButton(serialNumber, modelNumber, apnNumber, typeName);
                targetCell.appendChild(printButton);
            }
        });
    }

    // Initialize everything
    function init() {
        initTheme();
        createThemeToggle();
        addPrinterInput();

        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector("tbody tr")) {
                obs.disconnect();
                getIndexes();
                addPrintButtons();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        if (document.querySelector("tbody tr")) {
            getIndexes();
            addPrintButtons();
        }
    }

    // Start when page is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
