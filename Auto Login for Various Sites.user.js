// ==UserScript==
// @name         Auto Login for Various Sites
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  Automatically clicks login buttons for Slack, Example1, Example2, and Example3.
// @author       macrobso@
// @match        https://*.slack.com/?redir=*
// @match        https://*.slack.com/ssb/signin_redirect*
// @match        https://example1.com/*
// @match        https://example2.com/*
// @match        https://example3.com/*
// @match        https://example4.com/*
// @match        https://example5.com/*
// @icon         https://www.google.com/s2/favicons?domain=slack.com
// @grant        window.close
// @run-at       document-start
// ==/UserScript==

'use strict';

let signInClicked = false;

// Function to observe DOM changes
function onPageChange(callback) {
    new MutationObserver(callback).observe(document, {
        childList: true,
        subtree: true,
    });
}

// Function to handle page-specific actions
function handlePageChange() {
    // Slack login
    if (window.location.href.includes('slack.com')) {
        if (!signInClicked) {
            const signInButton = document.querySelector('.sign_in_sso_btn') ||
                document.getElementById('enterprise_member_guest_account_signin_link_Amazon Corp');
            if (signInButton) {
                signInButton.click();
                signInClicked = true;
            }
        }

        const spinner = document.querySelector('.infinite_spinner');
        if (spinner?.classList?.contains('fade')) {
            window.close();
        }

        const launchText = document.querySelector('.p-ssb_redirect__loading_messages');
        if (launchText?.innerText?.indexOf('Click "Open Slack"') >= 0) {
            window.close();
        }
    }

    // Example1 login
    if (window.location.href.includes('example1.com')) {
        const example1Button = document.querySelector('input[value="Example1"]');
        if (example1Button) {
            example1Button.click();
        }
    }

    // Example2 login
    if (window.location.href.includes('example2.com')) {
        setTimeout(() => {
            const example2LoginButton = document.querySelector('input[type="button"][value="Example2"]');
            if (example2LoginButton) {
                example2LoginButton.click();
            }
        }, 2000); // Adjust the timeout as needed
    }

    // Example3 login
    if (window.location.href.includes('example3.com')) {
        const example3Button = document.querySelector('button#federated\\ SignIn');
        if (example3Button) {
            example3Button.click();
        }
    }

    // Example4 login
    if (window.location.href.includes('example4.com')) {
        const example4LoginButton = document.querySelector('u[style="font-size: 14px;"]');
        if (example4LoginButton && example4LoginButton.innerText.includes('Login using Single Sign On')) {
            example4LoginButton.click();
        }
    }

    // Example5 login
    if (window.location.href.includes('example5.com')) {
        const example5LoginButton = document.querySelector('u[style="font-size: 14px;"]');
        if (example5LoginButton && example5LoginButton.innerText.includes('Login using Single Sign On')) {
            example5LoginButton.click();
        }
    }
}

// Start observing the page for changes and handle actions
onPageChange(handlePageChange);
handlePageChange();
