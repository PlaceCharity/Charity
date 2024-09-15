import { createEffect } from 'solid-js';
import { render } from 'solid-js/web';
import { getPanel } from '@violentmonkey/ui';

import * as canvas from '../lib/canvas';
import * as keybinds from './keybinds';

export const contactPanel = getPanel({
	className: 'charity-contact-info',
	shadow: false,
	theme: 'dark',
});
contactPanel.body.classList.add('charity-contact-panel');

let contactPanelOpen = false;
export function openContactPanel() {
	if (!contactPanelOpen) {
		contactPanel.show();
		document.body.parentElement!.appendChild(contactPanel.host);
		centerContactPanel();
		contactPanelOpen = true;
	}
}

export function closeContactPanel() {
	contactPanel.hide();
	contactPanelOpen = false;
}

let templateName: string = '';
let faction: string = '';
let contact: string = '';
createEffect(() => {
	if (templateName === canvas.templateName()) return;
	if (faction === canvas.faction()) return;
	if (contact === canvas.contact()) return;
	centerContactPanel();
	templateName = canvas.templateName();
	faction = canvas.faction();
	contact = canvas.contact();
});

createEffect(() => {
	if (canvas.contactVisible()) {
		contactPanel.wrapper.style.display = '';
		centerContactPanel();
	} else {
		contactPanel.wrapper.style.display = 'none';
	}
});

function centerContactPanel() {
	const { width } = contactPanel.body.getBoundingClientRect();
	const x = window.innerWidth / 2 - width / 2;
	contactPanel.wrapper.style.inset = `28px auto auto ${x}px`;
}

export async function init() {
	function ContactPanel() {
		return (
			<div>
				<p class='charity-contact-panel-line'>Artwork: {canvas.templateName()}</p>
				<p class='charity-contact-panel-line'>Faction: {canvas.faction()}</p>
				<p class='charity-contact-panel-line'>Contact: {canvas.contact()}</p>
				<p
					class='charity-contact-panel-subtext'
					style='font-size:0.75em;padding:0;margin:0;position:relative;top:5px;text-align:center;color:#aaaaaa'
				>
					(Press [{keybinds.contactInfoKeybind().display}] to hide)
				</p>
			</div>
		);
	}

	render(ContactPanel, contactPanel.body);

	document.documentElement.addEventListener('mousemove', (e: MouseEvent) => {
		canvas.updateContactPosition(e);
	});
}
