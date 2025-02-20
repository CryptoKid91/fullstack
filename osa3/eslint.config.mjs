import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	{
		rules: {
			indent: ['error', 'tab', { SwitchCase: 1 }],
			eqeqeq: 'error',
			'no-trailing-spaces': 'error',
			'object-curly-spacing': ['error', 'always'],
			'arrow-spacing': ['error', { before: true, after: true }],
			'no-console': 0,
			'no-fallthrough': 0,
			'no-case-declarations': 0,
		},
	},
	{
		ignores: ['dist'],
	},
];
