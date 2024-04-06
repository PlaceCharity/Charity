/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'base-100': '#2a303c',
				'base-200': '#242933',
				'base-300': '#1f242d',
				'base-content': '#a6adba',
				info: '#3abff8',
				'info-content': '#002b3d',
				success: '#36d399',
				'success-content': '#003320',
				warning: '#fbbd23',
				'warning-content': '#382800',
				error: '#f87272',
				'error-content': '#470000',
			},
		},
	},
	plugins: [],
};
