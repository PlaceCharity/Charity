import chalk from 'chalk';

export function log(string: string) {
	console.log(
		`${chalk.bold(
			`[${new Date().getUTCHours().toString().padStart(2, '0')}:${new Date()
				.getUTCMinutes()
				.toString()
				.padStart(2, '0')}:${new Date().getUTCSeconds().toString().padStart(2, '0')}]`,
		)} ${string}`,
	);
}
