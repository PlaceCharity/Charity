import * as utils from './utils';

export type Template = {
	name: string | null;
	sources: string[];
	x: number;
	y: number;
	frameWidth: number | null;
	frameHeight: number | null;
	frameCount: number;
	secondsPerFrame: number;
	startTimestamp: number;
	looping: boolean;
	priority: number;
	image: ImageBitmap;
};

type TemplateTree = Map<string, TemplateTree>;

let jsonTemplate: string;

const alreadyLoaded: string[] = [];
const templateCache: Map<string, any> = new Map();
const templateTree: TemplateTree = new Map();

async function findTemplate() {
	let sleep = 0;
	while (jsonTemplate === undefined) {
		const scriptValue = await GM.getValue('jsonTemplate', null);
		if (scriptValue === null) {
			await utils.sleep(1000 * sleep);
			sleep++;
		} else {
			jsonTemplate = scriptValue;
			break;
		}
	}
	await GM.deleteValue('jsonTemplate');
}

export async function init() {
	await findTemplate();
	templateTree.set(utils.getUniqueString(jsonTemplate), new Map());
	loadTemplateFromURL(jsonTemplate, templateTree.get(jsonTemplate));
}

async function loadTemplateFromURL(jsonTemplate: string, templateTree: TemplateTree) {
	const templateURL = new URL(jsonTemplate);
	templateURL.searchParams.append('date', utils.getCacheBustString());
	const uniqueString = utils.getUniqueString(jsonTemplate);

	alreadyLoaded.push(uniqueString);

	let json;
	try {
		const response = await utils.fetch({ method: 'GET', url: templateURL.href });
		json = JSON.parse(response.responseText);
	} catch (e) {
		// TODO: Failed to load toast.
		return;
	}

	if (json) {
		if (json.whitelist instanceof Array) {
			for (let whitelistURL of json.whitelist) {
				whitelistURL = utils.getUniqueString(whitelistURL.url);
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
					secondsPerFrame:
						json.templates[i].secondsPerFrame ||
						json.templates[i].frameRate ||
						json.templates[i].frameSpeed ||
						Infinity,
					startTimestamp: json.templates[i].startTimestamp || json.templates[i].startTime || 0,
					looping: json.templates[i].looping || (json.templates[i].frameCount || 1) > 1,
					image: await getImageFromTemplateSources(json.templates[i].sources || []),
				};
			}
			templateCache.set(uniqueString, json);
		}
	}
}

async function getImageFromTemplateSources(sources: string[]) {
	const requests = sources
		.sort(() => 0.5 - Math.random())
		.slice(0, 3)
		.map((t) => utils.fetch({ method: 'HEAD', url: t, responseType: 'blob' }));
	return await getImageFromTemplateSource(requests);
}

async function getImageFromTemplateSource(requests) {
	const headResponse = Promise.any(requests);
	requests.splice(requests.indexOf(headResponse));
	const headResponseHeaders = Object.fromEntries(
		(await headResponse).responseHeaders
			.split('\n')
			.map((l) => [l.slice(0, l.indexOf(':')).trim().toLowerCase(), l.slice(l.indexOf(':') + 1).trim()]),
	);
	if (parseInt(headResponseHeaders['content-length']) > 100000000) return getImageFromTemplateSource(requests);
	if (!headResponseHeaders['content-type'].startsWith('image')) return getImageFromTemplateSource(requests);

	const response = await utils.fetch({ method: 'GET', url: (await headResponse).finalUrl, responseType: 'blob' });
	if (!(response.response instanceof Blob)) return getImageFromTemplateSource(requests);
	if (!response.response.type.startsWith('image')) return getImageFromTemplateSource(requests);

	return createImageBitmap(response.response);
}

export function getInitialTraverseQueue() {
	if (!jsonTemplate) return [];
	const jsonTemplateTree = templateTree.get(utils.getUniqueString(jsonTemplate));
	if (!jsonTemplateTree) return [];
	return [
		{
			url: utils.getUniqueString(jsonTemplate),
			tree: templateTree.get(utils.getUniqueString(jsonTemplate)),
		},
	];
}

export function getTemplateCache() {
	return templateCache;
}
