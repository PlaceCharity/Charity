/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:svelte/recommended', 'prettier'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
	],
	rules: {
		'@typescript-eslint/no-var-requires': 'off',
		'handle-callback-err': 'off',
		'max-nested-callbacks': ['error', { max: 4 }],
		'no-console': 'off',
		'no-empty-function': 'error',
		'no-inline-comments': 'error',
		'no-lonely-if': 'error',
		'no-shadow': ['error', { allow: ['err', 'resolve', 'reject'] }],
		'no-var': 'error',
		'prefer-const': 'error',
		'spaced-comment': 'error',
		yoda: 'error',
	},
};
