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
