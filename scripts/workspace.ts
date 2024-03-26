// Thanks o-az! 
// https://github.com/oven-sh/bun/issues/5207#issuecomment-1958808495

import { file } from 'bun';
import { join } from 'node:path';
import { glob } from 'glob';

const [, , workspace, script] = process.argv;

const runScriptForWorkspace = (w: string) =>
	new Promise<number>((resolve, reject) => {
		console.info(`[workspace ${w}] Running script "${script}"`);
		Bun.spawn({
			cmd: ['bun', 'run', script],
			cwd: `./${w}`,
			stdio: ['inherit', 'inherit', 'inherit'],
			onExit(info) {
				if (info.exitCode !== 0) {
					console.log(`[workspace ${w}] The script failed with exit code ${info.exitCode}`);
					reject(info.exitCode);
				} else {
					console.log(`[workspace ${w}] The script ran successfully`);
					resolve(info.exitCode);
				}
			},
		});
	});

if (workspace != undefined && workspace.includes(',')) {
	const workspaces = workspace.split(',');
	for (const w of workspaces) {
		runScriptForWorkspace(w);
	}
} else if (workspace != undefined && workspace !== 'all' && !workspace.startsWith('-'))
	runScriptForWorkspace(workspace);
else {
	const excluded = workspace.startsWith('-') && workspace.slice(1);

	const packageJson = JSON.parse(
		await file(join(import.meta.dir, '../package.json')).text(),
	);

	const workspaces = packageJson.workspaces as string[];
	for (const w of workspaces) {
		if (w === excluded) continue;

		if (w.includes('*')) {
			const globWorkspaces = await glob(w);
			for (const globW of globWorkspaces) {
				await runScriptForWorkspace(globW);
			}
		} else {
			await runScriptForWorkspace(w);
		}
	}
}