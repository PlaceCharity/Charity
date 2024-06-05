// ==UserScript==
// @name        Charity Overlay
// @namespace   faction.place
// @description The most widely used overlay system on r/place.
// @icon        https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icon.png
// @icon64      https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icon64.png
// @version     0.1.1
// @author      Mikarific
// @match       http://localhost/*
// @match       http://localhost:8193/*
// @match       https://reddit.com/r/place/*
// @match       https://www.reddit.com/r/place/*
// @match       https://new.reddit.com/r/place/*
// @match       https://sh.reddit.com/r/place/*
// @run-at      document-idle
// @connect     *
// @allFrames   true
// @downloadURL https://github.com/PlaceCharity/
// @updateURL   https://github.com/PlaceCharity/
// @supportURL  https://discord.gg/anBdazHcrH
// @homepageURL https://discord.gg/anBdazHcrH
// @license     MIT
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/ui@0.7
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2/dist/solid.min.js
// @resource    settings https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/settings.svg
// @resource    close https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/close.svg
// @resource    discord https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/discord.svg
// @resource    github https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/github.svg
// @resource    faction-pride https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/factions/pride.gif
// @resource    faction-osu https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/factions/osu.png
// @grant       GM.addValueChangeListener
// @grant       GM.deleteValue
// @grant       GM.getResourceUrl
// @grant       GM.getValue
// @grant       GM.registerMenuCommand
// @grant       GM.setValue
// @grant       GM.xmlHttpRequest
// @grant       GM_addStyle
// @grant       unsafeWindow
// ==/UserScript==

(function (web, solidJs, ui) {
'use strict';

var css_248z = "*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.charity-overlay{image-rendering:-moz-crisp-edges!important;image-rendering:-webkit-crisp-edges!important;image-rendering:pixelated!important;image-rendering:crisp-edges!important;left:0!important;pointer-events:none!important;position:absolute!important;top:0!important}.charity-settings-icon{--un-shadow:8px 8px 0px 0px var(--un-shadow-color,rgba(0,0,0,.75))!important;--un-bg-opacity:1!important;--un-border-opacity:1!important;align-items:center!important;background-color:rgb(255 255 255/var(--un-bg-opacity))!important;border-color:rgb(0 0 0/var(--un-border-opacity))!important;border-style:solid!important;border-width:3px!important;box-shadow:var(--un-ring-offset-shadow),var(--un-ring-shadow),var(--un-shadow)!important;box-sizing:content-box!important;display:flex!important;height:38px!important;justify-content:center!important;padding:0!important;position:relative!important;visibility:visible!important;width:38px!important}\n\n.charity-settings-icon:active,.charity-settings-icon:hover{--un-bg-opacity:1!important;background-color:rgb(255 255 255/var(--un-bg-opacity))!important}.charity-settings-icon:active{--un-scale-x:0.95!important;--un-scale-y:0.95!important;background-image:linear-gradient(rgba(0,0,0,.3) 0 0)!important;transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotate(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z))!important}.charity-settings-icon:hover{background-image:linear-gradient(rgba(0,0,0,.2) 0 0)!important;cursor:pointer!important}.charity-settings-icon>img{margin:0!important;padding:8px!important}.charity-panel{visibility:visible!important}.charity-welcome-panel{--un-shadow:8px 8px 0px 0px var(--un-shadow-color,rgba(0,0,0,.75))!important;box-shadow:var(--un-ring-offset-shadow),var(--un-ring-shadow),var(--un-shadow)!important;box-sizing:content-box!important;cursor:move!important;max-width:261px!important;width:261px!important}.charity-settings-panel,.charity-welcome-panel{--un-bg-opacity:1!important;--un-text-opacity:1!important;--un-border-opacity:1!important;background-color:rgb(255 255 255/var(--un-bg-opacity))!important;border-color:rgb(0 0 0/var(--un-border-opacity))!important;border-style:solid!important;border-width:3px!important;color:rgb(0 0 0/var(--un-text-opacity))!important;display:flex!important;flex-direction:column!important;padding:21px!important;visibility:visible!important}.charity-settings-panel{box-sizing:border-box!important;height:100%!important;position:fixed!important;right:0!important;top:0!important;width:100%!important}\n\n@media (min-width:640px){.charity-settings-panel{width:400px!important}}.charity-panel-header{align-items:center!important;display:flex!important;justify-content:center!important}.charity-panel-header>h2{--un-text-opacity:1!important;color:rgb(0 0 0/var(--un-text-opacity))!important;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji!important;font-size:24px!important;font-weight:600!important;line-height:28px!important;margin-top:5px!important;padding:0!important}.charity-panel-body{align-items:center!important;display:flex!important;flex-direction:column!important;justify-content:center!important}.charity-panel-body-setting-header{display:flex!important;justify-content:space-between!important;margin-top:5px!important;max-width:500px!important;padding:8px 0 0!important;width:100%!important}.charity-panel-body-setting-header>h2{--un-text-opacity:1!important;color:rgb(0 0 0/var(--un-text-opacity))!important;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji!important;font-size:18px!important;font-weight:600!important;line-height:24px!important}.charity-setting-range{--un-border-opacity:1!important;-webkit-appearance:none!important;appearance:none!important;border-color:rgb(0 0 0/var(--un-border-opacity))!important;border-radius:0!important;border-style:solid!important;border-width:3px!important;box-sizing:content-box!important;cursor:pointer!important;height:29px!important;max-width:500px!important;overflow:hidden!important;width:100%!important}.charity-setting-range::-webkit-slider-runnable-track{background:#ddd}.charity-setting-range::-webkit-slider-thumb{--un-shadow:-500px 0 0 500px var(--un-shadow-color,#d93a00)!important;--un-bg-opacity:1!important;--un-outline-color-opacity:1!important;-webkit-appearance:none!important;appearance:none!important;background-color:rgb(255 255 255/var(--un-bg-opacity))!important;box-shadow:var(--un-ring-offset-shadow),var(--un-ring-shadow),var(--un-shadow)!important;box-sizing:border-box!important;height:29px!important;outline-color:rgb(0 0 0/var(--un-outline-color-opacity))!important;outline-style:solid!important;outline-width:3px!important;width:29px!important}.charity-panel-close{--un-border-left-opacity:var(--un-border-opacity)!important;--un-border-opacity:1!important;--un-border-bottom-opacity:var(--un-border-opacity)!important;align-items:center!important;border-bottom:3px solid rgb(0 0 0/var(--un-border-bottom-opacity))!important;border-left:3px solid rgb(0 0 0/var(--un-border-left-opacity))!important;box-sizing:content-box!important;cursor:pointer!important;display:flex!important;height:29px!important;justify-content:center!important;position:absolute!important;right:0!important;top:0!important;width:29px!important}.charity-panel-close>img{height:20px!important;margin:0!important;width:20px!important}.charity-panel-footer{--un-bg-opacity:1!important;--un-border-opacity:1!important;--un-border-top-opacity:var(--un-border-opacity)!important;background-color:rgb(255 255 255/var(--un-bg-opacity))!important;border-top:3px solid rgb(0 0 0/var(--un-border-top-opacity))!important;bottom:0!important;box-sizing:border-box!important;left:0!important;position:absolute!important;width:100%!important}.charity-panel-footer-branding{--un-border-opacity:1!important;--un-border-bottom-opacity:var(--un-border-opacity)!important;align-items:center!important;border-bottom:3px solid rgb(0 0 0/var(--un-border-bottom-opacity))!important;box-sizing:border-box!important;display:flex!important}.charity-panel-footer-branding>span{--un-text-opacity:1!important;color:rgb(0 0 0/var(--un-text-opacity))!important;flex-grow:1!important;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji!important;font-size:18px!important;font-weight:600!important;line-height:24px!important;padding-left:16px!important;padding-right:16px!important;white-space:nowrap!important}.charity-panel-footer-branding>a>img{--un-border-opacity:1!important;--un-border-left-opacity:var(--un-border-opacity)!important;border-left:3px solid rgb(0 0 0/var(--un-border-left-opacity))!important;box-sizing:content-box!important;height:24px!important;margin:0!important;padding:16px!important;vertical-align:bottom!important}\n\n.charity-panel-footer-branding>a>img:hover{--un-bg-opacity:1!important;background-color:rgb(255 255 255/var(--un-bg-opacity))!important;background-image:linear-gradient(rgba(0,0,0,.2) 0 0)!important;cursor:pointer!important}.charity-panel-footer-credits{--un-text-opacity:1!important;color:rgb(0 0 0/var(--un-text-opacity))!important;display:flex!important;flex-direction:column!important;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji!important;font-size:18px!important;font-weight:600!important;line-height:24px!important;padding:16px!important;text-align:center!important;white-space:nowrap!important}.charity-panel-footer-credits>span{height:32px!important}.charity-panel-footer-credits>ul{margin:0!important;text-align:left!important}.charity-panel-footer-credits>ul>li>a{--un-text-opacity:1!important;color:rgb(0 0 0/var(--un-text-opacity))!important;height:32px!important;margin:0!important;text-decoration:none!important;vertical-align:middle!important}\n\n.charity-panel-footer-credits>ul>li>a:hover{text-decoration:none!important}.charity-panel-footer-credits>ul>li>a>span{text-decoration-line:underline!important}.charity-panel-footer-credits>ul>li>a>img{height:32px!important;margin:0!important;vertical-align:middle!important}";

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

function asyncAddStyleSupport() {
  return typeof GM.addStyle !== 'undefined';
}
function valueChangeListenerSupport() {
  return typeof GM.addValueChangeListener !== 'undefined';
}
function menuCommandSupport() {
  return typeof GM.registerMenuCommand !== 'undefined';
}
function windowIsEmbedded() {
  return window.top !== window.self;
}
async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}
function negativeSafeModulo(a, b) {
  return (a % b + b) % b;
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
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}
function getUniqueString(string) {
  if (!isValidURL(string)) return null;
  const url = new URL(string);
  return `${url.origin}${url.pathname}`;
}
function getCacheBustString() {
  return Math.floor(Date.now() / 1000 * 60 * 2).toString(36);
}
function fetch(details) {
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest(_extends({}, details, {
      onload: response => resolve(response),
      onerror: err => reject(err),
      timeout: 10000
    }));
  });
}

let jsonTemplate;
const alreadyLoaded = [];
const templateCache = new Map();
const templateTree = new Map();
async function findTemplate() {
  let sleep$1 = 0;
  while (jsonTemplate === undefined) {
    const scriptValue = await GM.getValue('jsonTemplate', null);
    if (scriptValue === null) {
      await sleep(1000 * sleep$1);
      sleep$1++;
    } else {
      jsonTemplate = scriptValue;
      break;
    }
  }
  await GM.deleteValue('jsonTemplate');
}
async function init$2() {
  await findTemplate();
  templateTree.set(getUniqueString(jsonTemplate), new Map());
  loadTemplateFromURL(jsonTemplate, templateTree.get(jsonTemplate));
}
async function loadTemplateFromURL(jsonTemplate, templateTree) {
  if (!isValidURL(jsonTemplate)) return;
  const templateURL = new URL(jsonTemplate);
  templateURL.searchParams.append('date', getCacheBustString());
  const uniqueString = getUniqueString(jsonTemplate);
  alreadyLoaded.push(uniqueString);
  let json;
  try {
    const response = await fetch({
      method: 'GET',
      url: templateURL.href
    });
    json = JSON.parse(response.responseText);
  } catch (e) {
    // TODO: Failed to load toast.
    return;
  }
  if (json) {
    if (json.whitelist instanceof Array) {
      for (let whitelistURL of json.whitelist) {
        whitelistURL = getUniqueString(whitelistURL.url);
        if (whitelistURL) {
          templateTree.set(whitelistURL, new Map());
          if (!alreadyLoaded.includes(whitelistURL)) loadTemplateFromURL(whitelistURL, templateTree.get(whitelistURL));
        }
      }
    }
    if (json.templates instanceof Array) {
      for (let i = 0; i < json.templates.length; i++) {
        if (typeof json.templates[i].x !== 'number') return;
        if (typeof json.templates[i].y !== 'number') return;
        json.templates[i] = {
          name: json.templates[i].name || null,
          sources: json.templates[i].sources || [],
          x: json.templates[i].x,
          y: json.templates[i].y,
          frameWidth: json.templates[i].frameWidth || null,
          frameHeight: json.templates[i].frameHeight || null,
          frameCount: json.templates[i].frameCount || 1,
          secondsPerFrame: json.templates[i].secondsPerFrame || json.templates[i].frameRate || json.templates[i].frameSpeed || Infinity,
          startTimestamp: json.templates[i].startTimestamp || json.templates[i].startTime || 0,
          looping: json.templates[i].looping || (json.templates[i].frameCount || 1) > 1,
          currentFrame: -1,
          image: await getImageFromTemplateSources(json.templates[i].sources || [])
        };
      }
      templateCache.set(uniqueString, json);
    }
  }
}
async function getImageFromTemplateSources(sources) {
  const requests = sources.sort(() => 0.5 - Math.random()).slice(0, 3).map(t => fetch({
    method: 'HEAD',
    url: t,
    responseType: 'blob'
  }));
  return await getImageFromTemplateSource(requests);
}
async function getImageFromTemplateSource(requests) {
  const headResponse = Promise.any(requests);
  requests.splice(requests.indexOf(headResponse));
  const headResponseHeaders = Object.fromEntries((await headResponse).responseHeaders.split('\n').map(l => [l.slice(0, l.indexOf(':')).trim().toLowerCase(), l.slice(l.indexOf(':') + 1).trim()]));
  if (parseInt(headResponseHeaders['content-length']) > 100000000) return getImageFromTemplateSource(requests);
  if (!headResponseHeaders['content-type'].startsWith('image')) return getImageFromTemplateSource(requests);
  const response = await fetch({
    method: 'GET',
    url: (await headResponse).finalUrl,
    responseType: 'blob'
  });
  if (!(response.response instanceof Blob)) return getImageFromTemplateSource(requests);
  if (!response.response.type.startsWith('image')) return getImageFromTemplateSource(requests);
  return createImageBitmap(response.response);
}
function getInitialTraverseQueue() {
  if (!jsonTemplate) return [];
  const jsonTemplateTree = templateTree.get(getUniqueString(jsonTemplate));
  if (!jsonTemplateTree) return [];
  return [{
    url: getUniqueString(jsonTemplate),
    tree: templateTree.get(getUniqueString(jsonTemplate))
  }];
}
function getTemplateCache() {
  return templateCache;
}

let canvasElements = [];
let selectedCanvas;
const canvas = document.createElement('canvas');
let ctx;
canvas.classList.add('charity-overlay');
async function findCanvases() {
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
}
function selectBestCanvas(canvasElements) {
  if (canvasElements.length === 0) return null;
  selectedCanvas = canvasElements[0];
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
}
function updateOverlayCanvas(dotSize = 2) {
  if (!selectedCanvas) return;
  canvas.width = selectedCanvas.width;
  canvas.height = selectedCanvas.height;
  ctx = canvas.getContext('2d');
  const dotSizes = [0, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 1];
  canvas.style.maskImage = `conic-gradient(at ${dotSizes[dotSize]}px ${dotSizes[dotSize]}px, transparent 75%, black 0)`;
  canvas.style.maskSize = '1px 1px';
  canvas.style.maskPosition = `${(1 - dotSizes[dotSize]) / 2}px ${(1 - dotSizes[dotSize]) / 2}px`;
  selectedCanvas.parentElement.appendChild(canvas);
}
async function init$1() {
  await findCanvases();
  if (canvasElements === undefined) return;
  selectBestCanvas(canvasElements);
  if (selectedCanvas === undefined) return;
  console.log('Found Canvas:');
  console.log(selectedCanvas);
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = css_248z;
  selectedCanvas.parentElement.appendChild(style);
  updateOverlayCanvas();
  draw();
}
function draw() {
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'destination-over';
  const seenList = new Set();
  const traverseQueue = getInitialTraverseQueue();
  while (traverseQueue.length > 0) {
    traverseQueue[0].tree.forEach((value, key) => {
      if (!seenList.has(key)) {
        traverseQueue.push({
          url: key,
          tree: value
        });
      } else {
        traverseQueue[0].tree.delete(key);
      }
    });
    if (!seenList.has(traverseQueue[0].url) && getTemplateCache().has(traverseQueue[0].url)) {
      const templateJson = getTemplateCache().get(traverseQueue[0].url);
      if (templateJson && templateJson.templates) {
        for (const template of templateJson.templates) {
          try {
            drawTemplate(template);
          } catch (e) {
            console.error(e);
          }
        }
      }
    }
    seenList.add(traverseQueue.shift().url);
  }
  requestAnimationFrame(draw);
}
function getCurrentFrameIndex(template, currentSeconds) {
  if (!template.looping && template.startTimestamp + template.frameCount * template.secondsPerFrame < currentSeconds) return template.frameCount - 1;
  return negativeSafeModulo(Math.floor((currentSeconds - template.startTimestamp) / template.secondsPerFrame), template.frameCount);
}
function drawTemplate(template) {
  var _ref, _ref2, _ref3, _template$frameWidth, _template$frameHeight, _template$frameWidth2, _template$frameHeight2;
  const currentSeconds = Date.now() / 1000;
  if (!template.looping && currentSeconds > template.startTimestamp + template.secondsPerFrame * template.frameCount) return;
  if (!template.image) return;
  const frameIndex = getCurrentFrameIndex(template, currentSeconds);
  if (template.image.width === 0 || template.image.height === 0) return;
  const gridWidth = Math.round((_ref = template.image.width / template.frameWidth) != null ? _ref : template.image.width);
  const gridX = frameIndex % gridWidth;
  const gridY = Math.floor(frameIndex / gridWidth);
  ctx.drawImage(template.image, (_ref2 = gridX * template.frameWidth) != null ? _ref2 : template.image.width, (_ref3 = gridY * template.frameHeight) != null ? _ref3 : template.image.height, (_template$frameWidth = template.frameWidth) != null ? _template$frameWidth : template.image.width, (_template$frameHeight = template.frameHeight) != null ? _template$frameHeight : template.image.height, template.x, template.y, (_template$frameWidth2 = template.frameWidth) != null ? _template$frameWidth2 : template.image.width, (_template$frameHeight2 = template.frameHeight) != null ? _template$frameHeight2 : template.image.height);
  template.currentFrame = frameIndex;
}

const settings = GM.info.scriptHandler !== 'FireMonkey' ? GM.getResourceUrl('settings') : Promise.resolve('https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/settings.svg');
const close = GM.info.scriptHandler !== 'FireMonkey' ? GM.getResourceUrl('close') : Promise.resolve('https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/close.svg');
const discord = GM.info.scriptHandler !== 'FireMonkey' ? GM.getResourceUrl('discord') : Promise.resolve('https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/discord.svg');
const github = GM.info.scriptHandler !== 'FireMonkey' ? GM.getResourceUrl('github') : Promise.resolve('https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/github.svg');
const factionPride = GM.info.scriptHandler !== 'FireMonkey' ? GM.getResourceUrl('faction-pride') : Promise.resolve('https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/factions/pride.gif');
const factionOsu = GM.info.scriptHandler !== 'FireMonkey' ? GM.getResourceUrl('faction-osu') : Promise.resolve('https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/factions/osu.png');

var _tmpl$ = /*#__PURE__*/web.template(`<img>`),
  _tmpl$2 = /*#__PURE__*/web.template(`<div><div class=charity-panel-header><h2>Charity Settings</h2><div class=charity-panel-close><img></div></div><div class=charity-panel-body><div class=charity-panel-body-setting-header><h2>Dot Size</h2><h2></h2></div><input class=charity-setting-range type=range min=0 max=6 step=1></div><div class=charity-panel-footer><div class=charity-panel-footer-branding><span>Charity&nbsp;-&nbsp;v</span><a href=https://discord.gg/anBdazHcrH target=_blank><img></a><a href=https://github.com/PlaceCharity/Charity target=_blank><img></a></div><div class=charity-panel-footer-credits><span>Made&nbsp;with&nbsp;❤️&nbsp;by</span><ul><li><span>Mikarific&nbsp;from&nbsp;</span><a href=https://pride.place/ target=_blank><img>&nbsp;<span>r/PlacePride</span></a>.</li><li><span>April&nbsp;&&nbsp;Endu&nbsp;from&nbsp;</span><a href=https://osu.place/ target=_blank><img>&nbsp;<span>r/osuplace</span></a>.`);
if (!windowIsEmbedded()) {
  if (menuCommandSupport()) {
    GM.registerMenuCommand('Open Settings', () => GM.setValue('openSettings', true));
  }
}
async function init() {
  var _ref;
  const settingsIconResource = await settings;
  const closeIconResource = await close;
  const discordIconResource = await discord;
  const githubIconResource = await github;
  const factionPrideResource = await factionPride;
  const factionOsuResource = await factionOsu;
  const [dotSize, setDotSize] = solidJs.createSignal((_ref = await GM.getValue('dotSize')) != null ? _ref : 2);
  solidJs.createEffect(() => {
    updateOverlayCanvas(dotSize());
  });
  if (valueChangeListenerSupport()) {
    GM.addValueChangeListener('openSettings', (key, oldValue, newValue) => {
      if (newValue) {
        openSettings();
        GM.deleteValue('openSettings');
      }
    });
  } else {
    setInterval(async () => {
      if (await GM.getValue('openSettings')) {
        openSettings();
        GM.deleteValue('openSettings');
      }
    }, 500);
  }
  const settingsIcon = ui.getPanel({
    className: 'charity-panel',
    shadow: false,
    theme: 'dark'
  });
  settingsIcon.setMovable(true);
  settingsIcon.body.classList.add('charity-settings-icon');
  if (!menuCommandSupport()) {
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
    className: 'charity-panel',
    shadow: false,
    theme: 'dark'
  });
  settingsPanel.body.classList.add('charity-settings-panel');
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
    if (!menuCommandSupport()) settingsIcon.show();
    settingsPanelOpen = false;
  }
  function SettingsPanel() {
    return (() => {
      var _el$2 = _tmpl$2(),
        _el$3 = _el$2.firstChild,
        _el$4 = _el$3.firstChild,
        _el$5 = _el$4.nextSibling,
        _el$6 = _el$5.firstChild,
        _el$7 = _el$3.nextSibling,
        _el$8 = _el$7.firstChild,
        _el$9 = _el$8.firstChild,
        _el$10 = _el$9.nextSibling,
        _el$11 = _el$8.nextSibling,
        _el$12 = _el$7.nextSibling,
        _el$13 = _el$12.firstChild,
        _el$14 = _el$13.firstChild;
        _el$14.firstChild;
        var _el$16 = _el$14.nextSibling,
        _el$17 = _el$16.firstChild,
        _el$18 = _el$16.nextSibling,
        _el$19 = _el$18.firstChild,
        _el$20 = _el$13.nextSibling,
        _el$21 = _el$20.firstChild,
        _el$22 = _el$21.nextSibling,
        _el$23 = _el$22.firstChild,
        _el$24 = _el$23.firstChild,
        _el$25 = _el$24.nextSibling,
        _el$26 = _el$25.firstChild,
        _el$27 = _el$23.nextSibling,
        _el$28 = _el$27.firstChild,
        _el$29 = _el$28.nextSibling,
        _el$30 = _el$29.firstChild;
      _el$5.$$click = closeSettings;
      web.setAttribute(_el$6, "src", closeIconResource);
      web.insert(_el$10, () => ['0', '¼', '⅓', '½', '⅔', '¾', '1'][dotSize()]);
      _el$11.$$input = e => {
        GM.setValue('dotSize', parseInt(e.target.value));
        setDotSize(parseInt(e.target.value));
        updateOverlayCanvas(parseInt(e.target.value));
      };
      web.insert(_el$14, () => GM.info.script.version, null);
      web.setAttribute(_el$17, "src", discordIconResource);
      web.setAttribute(_el$19, "src", githubIconResource);
      web.setAttribute(_el$26, "src", factionPrideResource);
      web.setAttribute(_el$30, "src", factionOsuResource);
      web.effect(() => _el$11.value = dotSize());
      return _el$2;
    })();
  }
  web.render(SettingsPanel, settingsPanel.body);
}

// export function getdotSize() {
// 	const dotSizes = [0, 1 / 4, 1 / 3, 1 / 2, 1];
// 	return dotSizes[getDotSize()];
// }
web.delegateEvents(["mousemove", "click", "input"]);

if (asyncAddStyleSupport()) {
  GM.addStyle(css_248z);
} else {
  GM_addStyle(css_248z);
}
(async () => {
  // Reset GM values from top window
  if (!windowIsEmbedded()) {
    var _utils$findJSONTempla;
    GM.deleteValue('openSettings');
    GM.deleteValue('canvasFound');
    GM.setValue('jsonTemplate', (_utils$findJSONTempla = findJSONTemplateInURL(window.location)) != null ? _utils$findJSONTempla : '');
  }
  await init$1();
  await init$2();
  await init();
})();

})(VM.solid.web, VM.solid, VM);
