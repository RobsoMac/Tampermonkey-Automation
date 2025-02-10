// ==UserScript==
// @name         Auto Login for Various Sites
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  Automatically clicks login buttons for Slack, Austin, Argo, and KNet.
// @author       macrobso@
// @match        https://*.slack.com/?redir=*
// @match        https://*.slack.com/ssb/signin_redirect*
// @match        https://austin-ehs-prod-amzn-web-services.auth.us-east-1.amazoncognito.com/*
// @match        https://aws.argo.ocean-wave.aws.a2z.com/*
// @match        https://knet.csod.com/*
// @match        https://knet2.csod.com/*
// @match        https://us-east-1.quicksight.aws.amazon.com/sn/auth/signin/*
// @match        https://scm-hw-eng-clientv2-prod.auth.us-west-2.amazoncognito.com/*
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

    // Austin EHS login
    if (window.location.href.includes('austin-ehs-prod-amzn-web-services.auth.us-east-1.amazoncognito.com')) {
        const amazonButton = document.querySelector('input[value="Amazon"]');
        if (amazonButton) {
            amazonButton.click();
        }
    }

    // SCM HW ENG Client login
    if (window.location.href.includes('scm-hw-eng-clientv2-prod.auth.us-west-2.amazoncognito.com')) {
        setTimeout(() => {
            const scmLoginButton = document.querySelector('input[type="button"][value="Amazon"]');
            if (scmLoginButton) {
                scmLoginButton.click();
            }
        }, 2000); // Adjust the timeout as needed
    }

    // Argo AWS login
    if (window.location.href.includes('aws.argo.ocean-wave.aws.a2z.com')) {
        const supplyChainButton = document.querySelector('button#federated\\ SignIn');
        if (supplyChainButton) {
            supplyChainButton.click();
        }
    }

    // KNet login
    if (window.location.href.includes('knet.csod.com')) {
        const knetLoginButton = document.querySelector('u[style="font-size: 14px;"]');
        if (knetLoginButton && knetLoginButton.innerText.includes('Login using Single Sign On')) {
            knetLoginButton.click();
        }
    }

    // KNet2 login
    if (window.location.href.includes('knet2.csod.com')) {
        const knetLoginButton = document.querySelector('u[style="font-size: 14px;"]');
        if (knetLoginButton && knetLoginButton.innerText.includes('Login using Single Sign On')) {
            knetLoginButton.click();
        }
    }
}

// Start observing the page for changes and handle actions
onPageChange(handlePageChange);
handlePageChange();
