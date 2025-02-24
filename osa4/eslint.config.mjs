import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
	{ languageOptions: { globals: { ...globals.node, ...globals.jest } } },
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
			'no-unused-vars': [
				'error',
				{ varsIgnorePattern: '^_$', argsIgnorePattern: '^_$' },
			],
			'comma-dangle': [
				'error',
				{
					arrays: 'always-multiline',
					objects: 'always-multiline',
					functions: 'never',
				},
			],
			'arrow-parens': ['error', 'always'],
		},
	},
	{
		ignores: ['dist'],
	},
];
