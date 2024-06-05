export function asyncAddStyleSupport() {
	return typeof GM.addStyle !== 'undefined';
}

export function valueChangeListenerSupport() {
	return typeof GM.addValueChangeListener !== 'undefined';
}

export function menuCommandSupport() {
	return typeof GM.registerMenuCommand !== 'undefined';
}

export function windowIsEmbedded() {
	return window.top !== window.self;
}

export async function sleep(ms: number) {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

function findJSONTemplateInParams(urlString: string): string | null {
	const urlSearchParams = new URLSearchParams(urlString);
	return urlSearchParams.get('charity');
}

export function findJSONTemplateInURL(url: URL | Location): string | null {
	return findJSONTemplateInParams(url.hash.substring(1)) || findJSONTemplateInParams(url.search.substring(1));
}

export function findElementOfType<T>(element: Element | ShadowRoot, type: new () => T): T[] {
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

function isValidURL(url: string) {
	try {
		new URL(url);
		return true;
	} catch (err) {
		return false;
	}
}

export function getUniqueString(string: string) {
	if (!isValidURL(string)) return null;
	const url = new URL(string);
	return `${url.origin}${url.pathname}`;
}

export function getCacheBustString() {
	return Math.floor((Date.now() / 1000) * 60 * 2).toString(36);
}

export function fetch(
	details: VMScriptGMXHRDetails<string | object | Document | Blob | ArrayBuffer>,
): Promise<VMScriptResponseObject<string | object | Document | Blob | ArrayBuffer>> {
	return new Promise((resolve, reject) => {
		GM.xmlHttpRequest({
			...details,
			onload: (response) => resolve(response),
			onerror: (err) => reject(err),
			timeout: 10000,
		});
	});
}
