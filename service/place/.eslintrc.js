module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
	],
	plugins: ['@typescript-eslint'],
	env: {
		browser: true,
		node: true,
	},
	rules: {
		'@typescript-eslint/no-explicit-any': ['off'],
	},
};
