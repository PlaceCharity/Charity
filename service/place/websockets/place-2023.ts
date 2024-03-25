// @ts-ignore
import config from '../config.toml';

import chalk from 'chalk';

import { createCanvasImage } from '../handlers/canvas';
import { createPaletteFiles } from '../handlers/palette';

function configurationQuery() {
	return JSON.stringify({
		id: '0',
		type: 'start',
		payload: {
			variables: {
				input: {
					channel: {
						teamOwner: 'GARLICBREAD',
						category: 'CONFIG',
					},
				},
			},
			extensions: {},
			operationName: 'configuration',
			query: `
subscription configuration($input: SubscribeInput!) {
	subscribe(input: $input) {
		id
		... on BasicMessage {
			data {
				__typename
				... on ConfigurationMessageData {
					colorPalette {
						colors {
							hex
							index
							__typename
						}
						__typename
					}
					canvasConfigurations {
						index
						dx
						dy
						__typename
					}
                    activeZone {
                        topLeft {
                            x
                            y
                            __typename
                        }
                        bottomRight {
                            x
                            y
                            __typename
                        }
                        __typename
                    }
					canvasWidth
					canvasHeight
                    adminConfiguration {
                        maxAllowedCircles
                        maxUsersPerAdminBan
                        __typename
                    }
					__typename
				}
			}
			__typename
		}
		__typename
	}
}
			`.trim(),
		},
	});
}

function replaceQuery(chunkIndex: number) {
	return JSON.stringify({
		id: (chunkIndex + 1).toString(),
		type: 'start',
		payload: {
			variables: {
				input: {
					channel: {
						teamOwner: 'GARLICBREAD',
						category: 'CANVAS',
						tag: chunkIndex.toString(),
					},
				},
			},
			extensions: {},
			operationName: 'replace',
			query: `
subscription replace($input: SubscribeInput!) {
	subscribe(input: $input) {
		id
		... on BasicMessage {
			data {
				__typename
				... on FullFrameMessageData {
					__typename
					name
					timestamp
				}
				... on DiffFrameMessageData {
					__typename
					name
					currentTimestamp
					previousTimestamp
				}
			}
			__typename
		}
		__typename
	}
}
			`.trim(),
		},
	});
}

export function getCanvas2023() {
	try {
		let createdPalette = false;
		let createdCanvas = false;
		const canvasConfiguration: {
			width: number;
			height: number;
			chunks: { index: number; dx: number; dy: number; image?: ArrayBuffer }[];
			chunkWidth: number;
			chunkHeight: number;
			activeZone: { topLeft: { x: number; y: number }; bottomRight: { x: number; y: number } };
		} = {
			width: 0,
			height: 0,
			chunks: [],
			chunkWidth: 0,
			chunkHeight: 0,
			activeZone: { topLeft: { x: 0, y: 0 }, bottomRight: { x: 0, y: 0 } },
		};

		const socket = new WebSocket(config.websocket.url, {
			headers: {
				origin: config.websocket.origin,
			},
			protocol: 'graphql-ws',
		});

		socket.addEventListener('open', () => {
			socket.send(JSON.stringify({ type: 'connection_init', payload: { Authorization: config.websocket.auth } }));
		});

		socket.addEventListener('message', async (event) => {
			const json = JSON.parse(event.data.toString());
			if (json.type === undefined || json.type === null) return;
			if (json.type === 'connection_ack') socket.send(configurationQuery());
			if (json.type === 'connection_error' && json.payload.message === 'request is missing authentication data') {
				// TODO: Notify Mikarific to get a new frickin auth token
			}
			if (json.type === 'data') {
				const data = json.payload.data?.subscribe.data;
				if (data === undefined) return;
				const dataType = data.__typename;
				if (dataType === 'ConfigurationMessageData') {
					socket.send(JSON.stringify({ id: json.id, type: 'stop' }));
					if (!createdPalette) {
						const colors = data.colorPalette.colors
							.sort((a: { index: number }, b: { index: number }) => a.index - b.index)
							.map((color: { hex: string }) => color.hex);
						createPaletteFiles(colors);
						createdPalette = true;
					}

					canvasConfiguration.chunks = data.canvasConfigurations.map(
						(chunk: { index: number; dx: number; dy: number }) => {
							return { index: chunk.index, dx: chunk.dx, dy: chunk.dy };
						},
					);
					canvasConfiguration.chunkWidth = data.canvasWidth;
					canvasConfiguration.chunkHeight = data.canvasHeight;
					canvasConfiguration.activeZone = data.activeZone;
					canvasConfiguration.width = 0;
					canvasConfiguration.height = 0;
					for (const chunk of canvasConfiguration.chunks) {
						if (chunk.dx + canvasConfiguration.chunkWidth > canvasConfiguration.width) {
							canvasConfiguration.width = chunk.dx + canvasConfiguration.chunkWidth;
						}
						if (chunk.dy + canvasConfiguration.chunkHeight > canvasConfiguration.height) {
							canvasConfiguration.height = chunk.dy + canvasConfiguration.chunkHeight;
						}
						socket.send(replaceQuery(chunk.index));
					}
				}
				if (dataType === 'FullFrameMessageData') {
					socket.send(JSON.stringify({ id: json.id, type: 'stop' }));
					const chunk = canvasConfiguration.chunks.find((chunk) => chunk.index === parseInt(json.id) - 1);
					if (chunk === undefined) return;
					if (chunk.image === undefined) {
						chunk.image = await (await fetch(data.name.replace('localhost', 'winhost'))).arrayBuffer();
					}
					if (canvasConfiguration.chunks.filter((chunk) => chunk.image === undefined).length === 0 && !createdCanvas) {
						socket.send(JSON.stringify({ type: 'connection_terminate', payload: null }));
						socket.close();
						createCanvasImage(canvasConfiguration);
						createdCanvas = true;
					}
				}
			}
		});

		setTimeout(() => {
			socket.close();
		}, 15000);
	} catch {
		console.error(chalk.bold.red('Something went wrong while getting the canvas!'));
	}
}
