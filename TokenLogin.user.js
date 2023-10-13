// ==UserScript==
// @name         Discord Token Login
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows you to login with user tokens!
// @author       Pixeluted
// @match        https://discord.com/login*
// @grant        none
// ==/UserScript==

let isTokenLoginActive = false;

function performTokenLogin(token) {
  setInterval(() => {
    document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage.token = `"${token}"`;
  }, 50);
  setTimeout(() => {
    location.reload();
  }, 100);
}

function attachTokenLoginListener() {
  const loginBtn = document.querySelector('.marginBottom8-emkd0_.button-1cRKG6.button-ejjZWC.lookFilled-1H2Jvj.colorBrand-2M3O3N.sizeLarge-2xP3-w.fullWidth-3M-YBR.grow-2T4nbg');
  const tokenInputField = document.querySelector('.inputDefault-Ciwd-S.input-3O04eu.inputField-2RZxdl');

  loginBtn.addEventListener('click', function(event) {
    event.preventDefault();
    event.stopPropagation();
    performTokenLogin(tokenInputField.value);
  });
}

function modifyPageForTokenLogin() {
  const elementsToRemove = [
    '.transitionGroup-14WiKS.qrLogin-1ejtpI',
    '.verticalSeparator-2r9gHa',
    '.block-3uVSn4 > div:nth-child(2)',
    '.marginBottom20-315RVT.marginTop4-2JFJJI.linkButton-2ax8wP.button-ejjZWC.lookLink-13iF2K.lowSaturationUnderline-Z6CW6z.colorLink-34zig_.sizeMin-3Yqxk5.grow-2T4nbg'
  ];

  const labelElements = document.querySelectorAll('.label-7akf7-.eyebrow-2wJAoF.defaultColor-3Olr-9.defaultMarginlabel-26Urq5');
  labelElements.forEach((element) => {
    element.innerText = 'INSERT YOUR TOKEN';
  });

  elementsToRemove.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      element.addEventListener('click', function(event) {
        event.stopPropagation();
      });
      element.remove();
    });
  });

  const inputField = document.querySelector('.inputDefault-Ciwd-S.input-3O04eu.inputField-2RZxdl');
  inputField.type = "password";

  attachTokenLoginListener();
}

(function() {
  'use strict';

  console.log("Script initiated");

  function addSwitchButton() {
    const originalLoginBtn = document.querySelector('button.marginBottom8-emkd0_:nth-child(4)');
    if (originalLoginBtn) {
      const tokenLoginBtn = originalLoginBtn.cloneNode(true);
      originalLoginBtn.parentNode.appendChild(tokenLoginBtn);

      tokenLoginBtn.children[0].innerText = "Use token";

      originalLoginBtn.parentNode.appendChild(document.querySelector("div.marginTop4-2JFJJI"));

      tokenLoginBtn.addEventListener("click", function(event) {
        event.preventDefault();
        event.stopPropagation();

        if (!isTokenLoginActive) {
          modifyPageForTokenLogin();
          tokenLoginBtn.children[0].innerText = "Back";
          isTokenLoginActive = true;
        } else {
          location.reload();
        }
      });
    } else {
      setTimeout(addSwitchButton, 500);
    }
  }

  setTimeout(addSwitchButton, 1000);
})();
