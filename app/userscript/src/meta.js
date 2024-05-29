// ==UserScript==
// @name        Charity Overlay
// @namespace   faction.place
// @description The most widely used overlay system on r/place.
// @icon        https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icon.png
// @icon64      https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icon64.png
// @version     process.env.VERSION
// @author      process.env.AUTHOR
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
// @license     process.env.LICENSE
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/ui@0.7
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2/dist/solid.min.js
// @resource    settings https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/settings.svg
// @resource    close https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/close.svg
// @grant       GM_addStyle
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM.getResourceUrl
// @grant       GM.registerMenuCommand
// @grant       GM.xmlHttpRequest
// ==/UserScript==

/**
 * Code here will be ignored on compilation. So it's a good place to leave messages to developers.
 *
 * - The `@grant`s used in your source code will be added automatically by `rollup-plugin-userscript`.
 *   However you have to add explicitly those used in required resources.
 * - `process.env.VERSION`, `process.env.AUTHOR` and `process.env.LICENSE` will be loaded from `package.json`.
 */
