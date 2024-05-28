// ==UserScript==
// @name        Charity Overlay
// @namespace   faction.place
// @description The most widely used overlay system on r/place.
// @icon        https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icon.png
// @icon64      https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icon64.png
// @version     0.1.0
// @author      Mikarific
// @match       http://localhost/*
// @match       http://localhost:8193/*
// @match       https://reddit.com/r/place/*
// @match       https://www.reddit.com/r/place/*
// @match       https://new.reddit.com/r/place/*
// @match       https://sh.reddit.com/r/place/*
// @run-at      document-start
// @connect     *
// @allFrames   true
// @downloadURL https://github.com/PlaceCharity/
// @updateURL   https://github.com/PlaceCharity/
// @supportURL  https://discord.gg/anBdazHcrH
// @homepageURL https://discord.gg/anBdazHcrH
// @license     MIT
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/ui@0.7
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2/dist/solid.min.js
// @grant       GM.deleteValue
// @grant       GM.getValue
// @grant       GM.registerMenuCommand
// @grant       GM.setValue
// @grant       GM_addStyle
// ==/UserScript==

(async () => {
if(GM.info.scriptHandler === 'Greasemonkey') alert('Charity Overlay has dropped support for Greasemonkey!\n\nIn all honesty nobody should be using Greasemonkey in 2024.\n\nFor a lightweight, privacy focused alternative, my recommendation is to switch to FireMonkey.\n\nFor an open source, one size fits all solution, my recommendation is to switch to Violentmonkey.');
(function (web, ui) {
'use strict';

var css_248z = "*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.panel{cursor:move!important;max-height:75%!important;max-width:75%!important;min-width:16rem!important}.panel-body{height:100%!important;width:100%!important}";

function windowIsEmbedded() {
  return window.top !== window.self;
}
async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}
function findJSONTemplateInParams(urlString) {
  const urlSearchParams = new URLSearchParams(urlString);
  return urlSearchParams.get('charity');
}
function findJSONTemplateInURL(url) {
  return findJSONTemplateInParams(url.hash.substring(1)) || findJSONTemplateInParams(url.search.substring(1));
}
function findElementOfType(element, type) {
  const rv = [];
  if (element instanceof type) {
    rv.push(element);
  }

  // find in Shadow DOM elements
  if (element instanceof HTMLElement && element.shadowRoot) {
    rv.push(...findElementOfType(element.shadowRoot, type));
  }
  // find in children
  for (let c = 0; c < element.children.length; c++) {
    rv.push(...findElementOfType(element.children[c], type));
  }
  return rv;
}

async function findCanvas() {
  let canvasElements = [];
  while (document.readyState !== 'complete') {
    await sleep(1000);
  }
  let sleep$1 = 0;
  while (canvasElements.length === 0) {
    if ((await GM.getValue('canvasFound', false)) && !windowIsEmbedded()) return;
    await sleep(1000 * sleep$1);
    sleep$1++;
    canvasElements = findElementOfType(document.documentElement, HTMLCanvasElement);
  }
  GM.setValue('canvasFound', true);
  return canvasElements;
}
async function findTemplate() {
  let jsonTemplate;
  let sleep$1 = 0;
  while (jsonTemplate === undefined) {
    const scriptValue = await GM.getValue('jsonTemplate', '');
    if (scriptValue === '') {
      await sleep(1000 * sleep$1);
      sleep$1++;
    } else {
      jsonTemplate = scriptValue;
      break;
    }
  }
  await GM.deleteValue('jsonTemplate');
  return jsonTemplate;
}

var _tmpl$ = /*#__PURE__*/web.template(`<div>SETTINGS`);
const settingsPanel = ui.getPanel({
  className: 'panel',
  shadow: false,
  theme: 'dark'
});
settingsPanel.setMovable(true);
settingsPanel.body.classList.add('panel-body');
function SettingsPanel() {
  return _tmpl$();
}
web.render(SettingsPanel, settingsPanel.body);
let settingsPanelOpen = false;
function openSettings() {
  if (!settingsPanelOpen) {
    settingsPanel.show();
    document.body.appendChild(settingsPanel.host);
    const {
      width,
      height
    } = settingsPanel.body.getBoundingClientRect();
    const x = window.innerWidth / 2 - width / 2;
    const y = window.innerHeight / 2 - height / 2;
    settingsPanel.wrapper.style.inset = `${y}px auto auto ${x}px`;
    settingsPanelOpen = !settingsPanelOpen;
  }
}
if (typeof GM.registerMenuCommand !== 'undefined') {
  GM.registerMenuCommand('Open Settings', openSettings, {
    autoClose: true
  });
}

GM_addStyle(css_248z);
(async () => {
  if (!windowIsEmbedded()) {
    var _utils$findJSONTempla;
    GM.deleteValue('canvasFound');
    GM.setValue('jsonTemplate', (_utils$findJSONTempla = findJSONTemplateInURL(window.location)) != null ? _utils$findJSONTempla : '');
  }
  const canvas = await findCanvas();
  if (canvas === undefined) return;
  console.log(`Found Canvas: ${canvas}`);
  const jsonTemplate = await findTemplate();
  if (jsonTemplate === undefined) return;
})();

})(VM.solid.web, VM);
})();
