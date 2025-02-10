// ==UserScript==
// @name         SIM Ticketing TPVR
// @version      1.3
// @description  Two Person Verification Rule add on to SIM Ticketing
// @author       macrobso@
// @match        https://t.example.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @downloadURL  https://example.com/downloadURL.js?download=true
// @updateURL    https://example.com/updateURL.js?download=true
// @grant        none
// globals jQuery, $, waitForKeyElements */
// ==/UserScript==

let my_alias = "YOUR ALIAS@";

function main(){
  let communication = document.getElementsByClassName("sim-commentCardPrimary--right");
  for (var i = 0; i < communication.length; i++){
    if (communication[i].getElementsByClassName("custom_tpvr").length < 1 && document.getElementsByClassName("sim-commentCardPrimary--author")[i].innerText !== my_alias){
      let span = document.createElement("span");
      span.style.display = "inline-block";
      span.innerHTML += '<button id="button'+i+'" class = "custom_tpvr"type="submit" value="button">TPVR</button>';
      communication[i].append(span);
      var this_button = document.getElementById("button"+i);
      this_button.value=document.getElementsByClassName("sim-commentCardPrimary--content")[i].innerText;
      this_button.name = document.getElementsByClassName("sim-commentCardPrimary--author")[i].innerText;
      this_button.addEventListener("click", addCommunication.bind(this));
    }
  }

}

function addCommunication(event){
  let button = event.target
  let text = "## TPVR Confirming the following is true:\nVerifier: "+my_alias+"\nRequester: "+button.name+"@\nDetails:\n\n"+button.value;
  document.getElementById("sim-communicationActions--createComment").focus();
  document.getElementById("sim-communicationActions--createComment").value =text;
  var script = document.createElement('script');
  script.innerHTML = `document.getElementById("sim-communicationActions--createComment").currentTarget = document.getElementById("sim-communicationActions--createComment");  document.getElementById("sim-communicationActions--createComment").dispatchEvent(new Event('input'));`;
  document.head.append(script);
  let submitButton = document.getElementsByClassName("awsui-button awsui-button-variant-primary awsui-hover-child-icons")[4];
  if (submitButton.innerText === "Post to Worklog" || submitButton.innerText === "Post to Correspondence"){
    submitButton.click();
  }
  document.head.removeChild(script)

}

function createStyleSheet(){
  var customStyleSheet = document.createElement("link");
  customStyleSheet.rel="stylesheet"
  customStyleSheet.href="https://example.com/SIM/TPVR/tpvr_styling.css";
  if (document.head){
    document.head.appendChild(customStyleSheet);
  }
}

function getAlias(){
  let my_full_name = document.getElementsByClassName("sim-navDropdown--user")[0].innerText;
  let regExp = /\(([^)]+)\)/;
  my_alias = regExp.exec(my_full_name)[1];
  console.log(my_full_name);
}

(function() {
  createStyleSheet();
  waitForKeyElements(".sim-navDropdown--user", getAlias);
  waitForKeyElements(".sim-commentCardPrimary--right", main);
})();
