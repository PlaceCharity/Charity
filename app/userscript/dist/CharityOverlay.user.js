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
// @resource    settings https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/settings.svg
// @resource    close https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/close.svg
// @grant       GM.deleteValue
// @grant       GM.getResourceUrl
// @grant       GM.getValue
// @grant       GM.registerMenuCommand
// @grant       GM.setValue
// @grant       GM.xmlHttpRequest
// @grant       GM_addStyle
// ==/UserScript==

(async () => {
if(GM.info.scriptHandler === 'Greasemonkey') alert('Charity Overlay has dropped support for Greasemonkey!\n\nIn all honesty nobody should be using Greasemonkey in 2024.\n\nFor a lightweight, privacy focused alternative, my recommendation is to switch to FireMonkey.\n\nFor an open source, one size fits all solution, my recommendation is to switch to Violentmonkey.');
(function (web, ui) {
'use strict';

var css_248z = "*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.settings-icon{--un-shadow:8px 8px 0px 0px var(--un-shadow-color,rgba(0,0,0,.75))!important;--un-bg-opacity:1!important;--un-border-opacity:1!important;align-items:center!important;background-color:rgb(255 255 255/var(--un-bg-opacity))!important;border-color:rgb(0 0 0/var(--un-border-opacity))!important;border-style:solid!important;border-width:3px!important;box-shadow:var(--un-ring-offset-shadow),var(--un-ring-shadow),var(--un-shadow)!important;box-sizing:content-box!important;display:flex!important;height:38px!important;justify-content:center!important;padding:0!important;position:relative!important;visibility:visible!important;width:38px!important}\n\n.settings-icon:active,.settings-icon:hover{--un-bg-opacity:1!important;background-color:rgb(255 255 255/var(--un-bg-opacity))!important}.settings-icon:active{--un-scale-x:0.95!important;--un-scale-y:0.95!important;background-image:linear-gradient(rgba(0,0,0,.3) 0 0)!important;transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotate(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z))!important}.settings-icon:hover{background-image:linear-gradient(rgba(0,0,0,.2) 0 0)!important;cursor:pointer!important}.settings-icon>img{margin:0!important;padding:8px!important}.panel{cursor:move!important}.panel,.settings-panel{visibility:visible!important}.settings-panel{--un-shadow:8px 8px 0px 0px var(--un-shadow-color,rgba(0,0,0,.75))!important;--un-bg-opacity:1!important;--un-text-opacity:1!important;--un-border-opacity:1!important;background-color:rgb(255 255 255/var(--un-bg-opacity))!important;border-color:rgb(0 0 0/var(--un-border-opacity))!important;border-style:solid!important;border-width:3px!important;box-shadow:var(--un-ring-offset-shadow),var(--un-ring-shadow),var(--un-shadow)!important;box-sizing:content-box!important;color:rgb(0 0 0/var(--un-text-opacity))!important;display:flex!important;flex-direction:column!important;padding:21px!important}.settings-header{align-items:center!important;display:flex!important;justify-content:space-between!important}.settings-header>h2{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji!important;font-size:18px!important;font-weight:600!important;line-height:24px!important;margin-top:5px!important;padding:0!important}.settings-close{--un-border-left-opacity:var(--un-border-opacity)!important;--un-border-opacity:1!important;--un-border-bottom-opacity:var(--un-border-opacity)!important;align-items:center!important;border-bottom:3px solid rgb(0 0 0/var(--un-border-bottom-opacity))!important;border-left:3px solid rgb(0 0 0/var(--un-border-left-opacity))!important;box-sizing:content-box!important;cursor:pointer!important;display:flex!important;height:29px!important;justify-content:center!important;position:absolute!important;right:0!important;top:0!important;width:29px!important}.settings-close>img{height:20px!important;margin:0!important;width:20px!important}";

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

let canvasElements$1 = [];
async function findCanvases() {
  while (document.readyState !== 'complete') {
    await sleep(1000);
  }
  let sleep$1 = 0;
  while (canvasElements$1.length === 0) {
    if ((await GM.getValue('canvasFound', false)) && !windowIsEmbedded()) return;
    await sleep(1000 * sleep$1);
    sleep$1++;
    canvasElements$1 = findElementOfType(document.documentElement, HTMLCanvasElement);
  }
  GM.setValue('canvasFound', true);
  return canvasElements$1;
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
function selectBestCanvas(canvasElements) {
  if (canvasElements.length === 0) return null;
  let selectedCanvas = canvasElements[0];
  let selectedBounds = selectedCanvas.getBoundingClientRect();
  for (let i = 0; i < canvasElements.length; i++) {
    const canvas = canvasElements[i];
    const canvasBounds = canvas.getBoundingClientRect();
    const selectedArea = selectedBounds.width * selectedBounds.height;
    const canvasArea = canvasBounds.width * canvasBounds.height;
    if (canvasArea > selectedArea) {
      selectedCanvas = canvas;
      selectedBounds = canvasBounds;
    }
  }
  return selectedCanvas;
}

const settings = GM.info.scriptHandler !== 'FireMonkey' ? GM.getResourceUrl('settings') : Promise.resolve('https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/settings.svg');
const close = GM.info.scriptHandler !== 'FireMonkey' ? GM.getResourceUrl('close') : Promise.resolve('https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/close.svg');

var _tmpl$ = /*#__PURE__*/web.template(`<img>`),
  _tmpl$2 = /*#__PURE__*/web.template(`<div><div class=settings-header><h2>Charity Settings</h2><div class=settings-close><img>`);
if (!windowIsEmbedded()) {
  if (typeof GM.registerMenuCommand !== 'undefined') {
    GM.registerMenuCommand('Open Settings', () => {
      window.postMessage('charitySettings');
      document.querySelectorAll('iframe').forEach(iframe => {
        iframe.contentWindow.postMessage('charitySettings');
      });
    }, {
      autoClose: true
    });
  }
}
async function init() {
  const settingsIconResource = await settings;
  const closeIconResource = await close;
  const settingsIcon = ui.getPanel({
    className: 'panel',
    shadow: false,
    theme: 'dark'
  });
  settingsIcon.setMovable(true);
  settingsIcon.body.classList.add('settings-icon');
  if (typeof GM.registerMenuCommand === 'undefined') {
    web.render(() => {
      let disableClick = false;
      return (() => {
        var _el$ = _tmpl$();
        _el$.$$click = () => {
          if (!disableClick) openSettings();
          disableClick = false;
        };
        _el$.$$mousemove = e => {
          if (e.buttons !== 0) disableClick = true;
        };
        web.setAttribute(_el$, "src", settingsIconResource);
        return _el$;
      })();
    }, settingsIcon.body);
    settingsIcon.show();
    settingsIcon.wrapper.style.inset = `87px auto auto ${window.innerWidth - 60}px`;
  }
  const settingsPanel = ui.getPanel({
    className: 'panel',
    shadow: false,
    theme: 'dark'
  });
  settingsPanel.setMovable(true);
  settingsPanel.body.classList.add('settings-panel');
  web.render(SettingsPanel, settingsPanel.body);
  let settingsPanelOpen = false;
  function openSettings() {
    if (!settingsPanelOpen) {
      settingsIcon.hide();
      settingsPanel.show();
      document.body.appendChild(settingsPanel.host);
      settingsPanel.wrapper.style.inset = `0px auto auto 0px`;
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
  function closeSettings() {
    settingsPanel.hide();
    if (typeof GM.registerMenuCommand === 'undefined') settingsIcon.show();
    settingsPanelOpen = false;
  }
  window.addEventListener('message', e => {
    if (e.data === 'charitySettings') openSettings();
  }, false);
  function SettingsPanel() {
    return (() => {
      var _el$2 = _tmpl$2(),
        _el$3 = _el$2.firstChild,
        _el$4 = _el$3.firstChild,
        _el$5 = _el$4.nextSibling,
        _el$6 = _el$5.firstChild;
      _el$5.$$click = closeSettings;
      web.setAttribute(_el$6, "src", closeIconResource);
      return _el$2;
    })();
  }
}
web.delegateEvents(["mousemove", "click"]);

GM_addStyle(css_248z);
let canvasElements = [];
let selectedCanvas;
(async () => {
  if (!windowIsEmbedded()) {
    var _utils$findJSONTempla;
    document.documentElement.classList.add('top-window');
    GM.deleteValue('canvasFound');
    GM.setValue('jsonTemplate', (_utils$findJSONTempla = findJSONTemplateInURL(window.location)) != null ? _utils$findJSONTempla : '');
  }
  canvasElements = await findCanvases();
  if (canvasElements === undefined) return;
  selectedCanvas = selectBestCanvas(canvasElements);
  if (selectedCanvas === undefined) return;
  console.log('Found Canvas:');
  console.log(selectedCanvas);
  document.documentElement.classList.add('canvas-window');
  init();
  const jsonTemplate = await findTemplate();
  console.log(jsonTemplate);
  const templateURL = new URL(jsonTemplate);
  GM.xmlHttpRequest({
    method: 'GET',
    url: templateURL.href,
    onload: response => {
      let json;
      try {
        json = JSON.parse(response.responseText);
      } catch (e) {
        console.error(`Failed to parse JSON from ${templateURL.href}.`);
        return;
      }
      if (json.templates) {
        for (let i = 0; i < json.templates.length; i++) {
          console.log(json.templates[i]);
        }
      }
    },
    onerror: console.error
  });
})();

})(VM.solid.web, VM);
})();
