import { Show, createEffect, createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import * as shortcut from '@violentmonkey/shortcut';
import { getPanel } from '@violentmonkey/ui';

import * as canvas from '../lib/canvas';
import * as contact from '../ui/contact';
import * as resources from '../lib/resources';
import * as utils from '../lib/utils';
import * as keybinds from './keybinds';

if (!utils.windowIsEmbedded()) {
	if (utils.menuCommandSupport()) {
		GM.registerMenuCommand('Open Settings', () => GM.setValue('openSettings', true));
	}
}

export async function init() {
	const settingsIconResource = await resources.settings;
	const closeIconResource = await resources.close;
	const backIconResource = await resources.back;
	const keyboardIconResource = await resources.keyboard;
	const versionResource = await resources.version;
	const discordIconResource = await resources.discord;
	const githubIconResource = await resources.github;

	const charityLogoResource = await resources.charityLogo;
	const factionPrideResource = await resources.factionPride;
	const factionOsuResource = await resources.factionOsu;

	const [dotSize, setDotSize] = createSignal((await GM.getValue('dotSize', 2)) as number);
	const [contactInfo, setContactInfo] = createSignal((await GM.getValue('contactInfo', false)) as boolean);
	const [settingsIconEnabled, setSettingsIconEnabled] = createSignal(
		(await GM.getValue('settingsIconEnabled', true)) as boolean,
	);

	createEffect(() => {
		canvas.updateOverlayCanvas(dotSize());
	});
	createEffect(() => {
		if (contactInfo()) {
			contact.openContactPanel();
		} else {
			contact.closeContactPanel();
		}
	});

	await keybinds.init();

	if (utils.valueChangeListenerSupport()) {
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

	const settingsIcon = getPanel({
		className: 'charity-panel',
		shadow: false,
		theme: 'dark',
	});
	settingsIcon.setMovable(true);
	settingsIcon.body.classList.add('charity-settings-icon');
	if (settingsIconEnabled()) {
		render(() => {
			let disableClick = false;
			return (
				<img
					src={settingsIconResource}
					onMouseMove={(e) => {
						if (e.buttons !== 0) disableClick = true;
					}}
					onClick={() => {
						if (!disableClick) openSettings();
						disableClick = false;
					}}
				/>
			);
		}, settingsIcon.body);

		settingsIcon.show();
		settingsIcon.wrapper.style.inset = `87px auto auto ${window.innerWidth - 60}px`;
	}

	const settingsPanel = getPanel({
		className: 'charity-panel',
		shadow: false,
		theme: 'dark',
	});
	settingsPanel.body.classList.add('charity-settings-panel');
	const [fadeShown, setFadeShown] = createSignal(false);
	const [keybindPanelOpen, setKeybindPanelOpen] = createSignal(false);

	let settingsPanelOpen = false;
	function openSettings() {
		if (!settingsPanelOpen) {
			settingsIcon.hide();
			settingsPanel.show();
			document.body.appendChild(settingsPanel.host);
			settingsPanelOpen = !settingsPanelOpen;
		}
	}
	function closeSettings() {
		settingsPanel.hide();
		if (settingsIconEnabled()) settingsIcon.show();
		settingsPanelOpen = false;
	}

	function SettingsPanel() {
		const versionCanvas = document.createElement('canvas');
		const versionCtx = versionCanvas.getContext('2d');
		const versionImage = new Image();
		versionImage.src = versionResource;
		versionImage.onload = () => {
			let versionWidth = 9;
			const versionCharacters = [...GM.info.script.version];
			for (let i = 0; i < versionCharacters.length; i++) {
				if (['.'].includes(versionCharacters[i])) versionWidth += 3;
				if (['1'].includes(versionCharacters[i])) versionWidth += 4;
				if (['7'].includes(versionCharacters[i])) versionWidth += 7;
				if (['2', '5'].includes(versionCharacters[i])) versionWidth += 8;
				if (['0', '3', '4', '6', '8', '9'].includes(versionCharacters[i])) versionWidth += 9;
			}

			versionCanvas.width = versionWidth;
			versionCanvas.height = 16;

			let versionCursor = 9;
			versionCtx.drawImage(versionImage, 0, 0, 9, 16, 0, 0, 9, 16);

			for (let i = 0; i < versionCharacters.length; i++) {
				if (versionCharacters[i] === '.') versionCtx.drawImage(versionImage, 9, 0, 3, 16, versionCursor, 0, 3, 16);
				if (versionCharacters[i] === '0') versionCtx.drawImage(versionImage, 12, 0, 9, 16, versionCursor, 0, 9, 16);
				if (versionCharacters[i] === '1') versionCtx.drawImage(versionImage, 21, 0, 4, 16, versionCursor, 0, 4, 16);
				if (versionCharacters[i] === '2') versionCtx.drawImage(versionImage, 25, 0, 8, 16, versionCursor, 0, 8, 16);
				if (versionCharacters[i] === '3') versionCtx.drawImage(versionImage, 33, 0, 9, 16, versionCursor, 0, 9, 16);
				if (versionCharacters[i] === '4') versionCtx.drawImage(versionImage, 42, 0, 9, 16, versionCursor, 0, 9, 16);
				if (versionCharacters[i] === '5') versionCtx.drawImage(versionImage, 51, 0, 8, 16, versionCursor, 0, 8, 16);
				if (versionCharacters[i] === '6') versionCtx.drawImage(versionImage, 59, 0, 9, 16, versionCursor, 0, 9, 16);
				if (versionCharacters[i] === '7') versionCtx.drawImage(versionImage, 68, 0, 7, 16, versionCursor, 0, 7, 16);
				if (versionCharacters[i] === '8') versionCtx.drawImage(versionImage, 75, 0, 9, 16, versionCursor, 0, 9, 16);
				if (versionCharacters[i] === '9') versionCtx.drawImage(versionImage, 84, 0, 9, 16, versionCursor, 0, 9, 16);

				if (['.'].includes(versionCharacters[i])) versionCursor += 3;
				if (['1'].includes(versionCharacters[i])) versionCursor += 4;
				if (['7'].includes(versionCharacters[i])) versionCursor += 7;
				if (['2', '5'].includes(versionCharacters[i])) versionCursor += 8;
				if (['0', '3', '4', '6', '8', '9'].includes(versionCharacters[i])) versionCursor += 9;
			}
		};

		return (
			<div class='charity-settings-container'>
				<div class={`charity-panel-header ${fadeShown() ? 'charity-panel-header-fade' : ''}`}>
					<Show when={keybindPanelOpen()}>
						<div class='charity-panel-back' onClick={() => setKeybindPanelOpen(false)}>
							<img src={backIconResource} />
						</div>
					</Show>
					<h2>{keybindPanelOpen() ? 'Keybinds' : 'Charity Settings'}</h2>
					<div class='charity-panel-close' onClick={closeSettings}>
						<img src={closeIconResource} />
					</div>
				</div>
				<Show when={!keybindPanelOpen()}>
					<div class='charity-panel-body'>
						<button
							class='charity-setting-button'
							onClick={() => {
								setKeybindPanelOpen(true);
							}}
						>
							<img src={keyboardIconResource} />
							Keybinds...
						</button>
						<div class='charity-panel-body-setting-header'>
							<h2>Dot Size</h2>
							<h2>{['0', '¼', '⅓', '½', '⅔', '¾', '1'][dotSize()]}</h2>
						</div>
						<input
							class='charity-setting-range'
							type='range'
							min='0'
							max='6'
							onInput={(e) => {
								setDotSize(parseInt(e.target.value));
								GM.setValue('dotSize', dotSize());
								canvas.updateOverlayCanvas(dotSize());
							}}
							value={dotSize()}
							step='1'
						/>
						<div class='charity-panel-body-setting-header'>
							<h2>Contact Info</h2>
							<input
								type='checkbox'
								class='charity-setting-toggle'
								checked={contactInfo()}
								onClick={() => {
									setContactInfo(!contactInfo());
									GM.setValue('contactInfo', contactInfo());
								}}
							/>
						</div>
						<Show when={utils.menuCommandSupport()}>
							<div class='charity-panel-body-setting-header'>
								<h2>Settings Icon</h2>
								<input
									type='checkbox'
									class='charity-setting-toggle'
									checked={settingsIconEnabled()}
									onClick={() => {
										setSettingsIconEnabled(!settingsIconEnabled());
										GM.setValue('settingsIconEnabled', settingsIconEnabled());
									}}
								/>
							</div>
						</Show>
					</div>
				</Show>
				<Show when={keybindPanelOpen()}>
					<keybinds.KeybindsBody />
				</Show>
				<div class='charity-panel-footer'>
					<div class='charity-panel-footer-credits'>
						<span>Made&nbsp;with&nbsp;❤️&nbsp;by</span>
						<ul>
							<li>
								<span>Mikarific&nbsp;from&nbsp;</span>
								<a href='https://pride.place/' target='_blank'>
									<img src={factionPrideResource}></img>&nbsp;<span>r/PlacePride</span>
								</a>
								.
							</li>
							<li>
								<span>April&nbsp;&&nbsp;Endu&nbsp;from&nbsp;</span>
								<a href='https://osu.place/' target='_blank'>
									<img src={factionOsuResource}></img>&nbsp;<span>r/osuplace</span>
								</a>
								.
							</li>
						</ul>
					</div>
					<div class='charity-panel-footer-branding'>
						<div>
							<img src={charityLogoResource} />
							{versionCanvas}
						</div>
						<a href='https://discord.gg/anBdazHcrH' target='_blank'>
							<img src={discordIconResource}></img>
						</a>
						<a href='https://github.com/PlaceCharity/Charity' target='_blank'>
							<img src={githubIconResource}></img>
						</a>
					</div>
				</div>
			</div>
		);
	}

	render(SettingsPanel, settingsPanel.body);

	settingsPanel.body.addEventListener('scroll', () => {
		if (settingsPanel.body.scrollTop === 0) setFadeShown(false);
		if (settingsPanel.body.scrollTop !== 0) setFadeShown(true);
	});

	document.documentElement.addEventListener('keydown', (e: KeyboardEvent) => {
		if (!e.key || ['ctrl', 'control', 'shift', 'alt', 'meta', 'cmd'].includes(e.key.toLowerCase())) return;
		const shortcutKey = shortcut
			.buildKey({
				base: e.key,
				modifierState: {
					c: e.ctrlKey,
					s: e.shiftKey,
					a: e.altKey,
					m: e.metaKey,
				},
				caseSensitive: false,
			})
			.replace(/^i:/, '');

		if (keybinds.dotSizeIncreaseKeybind().register === shortcutKey) {
			setDotSize(Math.min(dotSize() + 1, 6));
			GM.setValue('dotSize', dotSize());
			canvas.updateOverlayCanvas(dotSize());
			e.preventDefault();
		}
		if (keybinds.dotSizeDecreaseKeybind().register === shortcutKey) {
			setDotSize(Math.max(dotSize() - 1, 0));
			GM.setValue('dotSize', dotSize());
			canvas.updateOverlayCanvas(dotSize());
			e.preventDefault();
		}
		if (keybinds.contactInfoKeybind().register === shortcutKey) {
			setContactInfo(!contactInfo());
			GM.setValue('contactInfo', contactInfo());
			e.preventDefault();
		}
	});
}
