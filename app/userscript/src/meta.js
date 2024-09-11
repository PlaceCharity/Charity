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
// @match       https://pxls.space/*
// @match       https://rplace.live/*
// @match       https://sinder.pxls.world/*
// @match       https://place.zevent.fr/*
// @match       https://canvas.kyubae.com/*
// @run-at      document-idle
// @connect     *
// @allFrames   true
// @downloadURL https://github.com/PlaceCharity/Charity/releases/latest/download/CharityOverlay.user.js
// @updateURL   https://github.com/PlaceCharity/Charity/releases/latest/download/CharityOverlay.user.js
// @supportURL  https://discord.gg/anBdazHcrH
// @homepageURL https://discord.gg/anBdazHcrH
// @license     process.env.LICENSE
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/ui@0.7
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2/dist/solid.min.js
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @resource    mask-1-4 https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/masks/1-4.png
// @resource    mask-1-3 https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/masks/1-3.png
// @resource    mask-1-2 https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/masks/1-2.png
// @resource    mask-2-3 https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/masks/2-3.png
// @resource    mask-3-4 https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/masks/3-4.png
// @resource    settings https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/settings.svg
// @resource    close https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/close.svg
// @resource    back https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/back.svg
// @resource    keyboard https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/keyboard.svg
// @resource    version https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/version.png
// @resource    discord https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/discord.svg
// @resource    github https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/icons/github.svg
// @resource    charity-logo https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/logo.png
// @resource    faction-pride https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/factions/pride.gif
// @resource    faction-osu https://raw.githubusercontent.com/PlaceCharity/Charity/main/app/userscript/assets/factions/osu.png
// @grant       GM_addStyle
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM.addValueChangeListener
// @grant       GM.getResourceUrl
// @grant       GM.registerMenuCommand
// @grant       GM.xmlHttpRequest
// @grant       unsafeWindow
// ==/UserScript==

/**
 * Code here will be ignored on compilation. So it's a good place to leave messages to developers.
 *
 * - The `@grant`s used in your source code will be added automatically by `rollup-plugin-userscript`.
 *   However you have to add explicitly those used in required resources.
 * - `process.env.VERSION`, `process.env.AUTHOR` and `process.env.LICENSE` will be loaded from `package.json`.
 */
