import { Accessor, Setter, Show, createSignal } from 'solid-js';
import * as shortcut from '@violentmonkey/shortcut';

const [changingKeybind, setChangingKeybind] = createSignal('');

export let showOverlayKeybind: Accessor<{ display: string; register: string }>;
let setShowOverlayKeybind: Setter<{ display: string; register: string }>;

export let dotSizeIncreaseKeybind: Accessor<{ display: string; register: string }>;
let setDotSizeIncreaseKeybind: Setter<{ display: string; register: string }>;

export let dotSizeDecreaseKeybind: Accessor<{ display: string; register: string }>;
let setDotSizeDecreaseKeybind: Setter<{ display: string; register: string }>;

export let contactInfoKeybind: Accessor<{ display: string; register: string }>;
let setContactInfoKeybind: Setter<{ display: string; register: string }>;

export async function init() {
	[showOverlayKeybind, setShowOverlayKeybind] = createSignal(
		await GM.getValue('showOverlayKeybind', {
			display: 'V',
			register: 'v',
		}),
	);
	[dotSizeIncreaseKeybind, setDotSizeIncreaseKeybind] = createSignal(
		await GM.getValue('dotSizeIncreaseKeybind', {
			display: 'PageUp',
			register: 'pageup',
		}),
	);
	[dotSizeDecreaseKeybind, setDotSizeDecreaseKeybind] = createSignal(
		await GM.getValue('dotSizeDecreaseKeybind', {
			display: 'PageDown',
			register: 'pagedown',
		}),
	);
	[contactInfoKeybind, setContactInfoKeybind] = createSignal(
		await GM.getValue('contactInfoKeybind', {
			display: 'C',
			register: 'c',
		}),
	);
}

export function KeybindsBody() {
	return (
		<div class='charity-panel-body'>
			<div class='charity-panel-body-setting-header'>
				<h2>Show Overlay</h2>
				<button
					class='charity-setting-keybind'
					onKeyDown={setKeybind}
					onClick={() => {
						setChangingKeybind('showOverlay');
					}}
					onFocusOut={resetChangingKeybind}
				>
					<Show when={changingKeybind() === 'showOverlay'}>...</Show>
					<Show when={changingKeybind() !== 'showOverlay'}>{showOverlayKeybind().display}</Show>
				</button>
			</div>
			<div class='charity-panel-body-setting-header'>
				<h2>Increase Dot Size</h2>
				<button
					class='charity-setting-keybind'
					onKeyDown={setKeybind}
					onClick={() => {
						setChangingKeybind('dotSizeIncrease');
					}}
					onFocusOut={resetChangingKeybind}
				>
					<Show when={changingKeybind() === 'dotSizeIncrease'}>...</Show>
					<Show when={changingKeybind() !== 'dotSizeIncrease'}>{dotSizeIncreaseKeybind().display}</Show>
				</button>
			</div>
			<div class='charity-panel-body-setting-header'>
				<h2>Decrease Dot Size</h2>
				<button
					class='charity-setting-keybind'
					onKeyDown={setKeybind}
					onClick={() => {
						setChangingKeybind('dotSizeDecrease');
					}}
					onFocusOut={resetChangingKeybind}
				>
					<Show when={changingKeybind() === 'dotSizeDecrease'}>...</Show>
					<Show when={changingKeybind() !== 'dotSizeDecrease'}>{dotSizeDecreaseKeybind().display}</Show>
				</button>
			</div>
			<div class='charity-panel-body-setting-header'>
				<h2>Contact Info</h2>
				<button
					class='charity-setting-keybind'
					onKeyDown={setKeybind}
					onClick={() => {
						setChangingKeybind('contactInfo');
					}}
					onFocusOut={resetChangingKeybind}
				>
					<Show when={changingKeybind() === 'contactInfo'}>...</Show>
					<Show when={changingKeybind() !== 'contactInfo'}>{contactInfoKeybind().display}</Show>
				</button>
			</div>
		</div>
	);
}

function setKeybind(e: KeyboardEvent) {
	if (changingKeybind() === '') return;
	e.preventDefault();
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
	const shortcutComponents = shortcutKey.split('-');
	let displayKey = '';
	if (shortcutComponents[0] === 'm' && shortcutComponents.length > 1) {
		displayKey += 'Meta + ';
		shortcutComponents.shift();
	}
	if (shortcutComponents[0] === 'c' && shortcutComponents.length > 1) {
		displayKey += 'Ctrl + ';
		shortcutComponents.shift();
	}
	if (shortcutComponents[0] === 's' && shortcutComponents.length > 1) {
		displayKey += 'Shift + ';
		shortcutComponents.shift();
	}
	if (shortcutComponents[0] === 'a' && shortcutComponents.length > 1) {
		displayKey += 'Alt + ';
		shortcutComponents.shift();
	}
	console.log(e);
	const keyCode =
		e.code
			.replace(/^Key|Digit/, '')
			.charAt(0)
			.toUpperCase() + e.code.replace(/^Key|Digit/, '').slice(1);
	displayKey += keyCode === '' ? e.key : keyCode;

	if (changingKeybind() === 'showOverlay') {
		if (e.key === 'Escape' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
			setShowOverlayKeybind({ display: 'None', register: '' });
			GM.setValue('showOverlayKeybind', showOverlayKeybind());
		} else {
			setShowOverlayKeybind({ display: displayKey, register: shortcutKey });
			GM.setValue('showOverlayKeybind', showOverlayKeybind());
		}
	}
	if (changingKeybind() === 'dotSizeIncrease') {
		if (e.key === 'Escape' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
			setDotSizeIncreaseKeybind({ display: 'None', register: '' });
			GM.setValue('dotSizeIncreaseKeybind', dotSizeIncreaseKeybind());
		} else {
			setDotSizeIncreaseKeybind({ display: displayKey, register: shortcutKey });
			GM.setValue('dotSizeIncreaseKeybind', dotSizeIncreaseKeybind());
		}
	}
	if (changingKeybind() === 'dotSizeDecrease') {
		if (e.key === 'Escape' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
			setDotSizeDecreaseKeybind({ display: 'None', register: '' });
			GM.setValue('dotSizeDecreaseKeybind', dotSizeDecreaseKeybind());
		} else {
			setDotSizeDecreaseKeybind({ display: displayKey, register: shortcutKey });
			GM.setValue('dotSizeDecreaseKeybind', dotSizeDecreaseKeybind());
		}
	}
	if (changingKeybind() === 'contactInfo') {
		if (e.key === 'Escape' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
			setContactInfoKeybind({ display: 'None', register: '' });
			GM.setValue('contactInfoKeybind', contactInfoKeybind());
		} else {
			setContactInfoKeybind({ display: displayKey, register: shortcutKey });
			GM.setValue('contactInfoKeybind', contactInfoKeybind());
		}
	}

	setChangingKeybind('');
}

function resetChangingKeybind() {
	setChangingKeybind('');
}
