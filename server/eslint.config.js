import { defineConfig } from 'eslint/config';
import globals from 'globals';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
	{
		ignores: ['**/dist/**', '**/node_modules/**', 'eslint.config.js'],
	},
	{
		files: ['./src/*.{js,mjs,cjs,ts}'],
		languageOptions: {
			globals: globals.node,
			ecmaVersion: 'latest',
			sourceType: 'module',
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
			},
		},
		plugins: {
			'@typescript-eslint': typescriptEslint,
			prettier: eslintPluginPrettier,
		},
		rules: {
			...typescriptEslint.configs['recommended'].rules,
			...eslintConfigPrettier.rules,
			'prettier/prettier': 'warn',
			'no-unused-vars': 'off',

			'@typescript-eslint/explicit-function-return-type': [
				'error',
				{
					allowExpressions: true, // Разрешает не указывать тип для callback-функций
					allowHigherOrderFunctions: true, // Разрешает не указывать тип для HOF
				},
			],
			'@typescript-eslint/no-unused-vars': 'error', // Включаем проверку неиспользуемых переменных
			'@typescript-eslint/no-floating-promises': 'error', // Проверяет незавершенные Promise

			// Дополнительные полезные правила
			'@typescript-eslint/await-thenable': 'error', // Проверяет await на thenable-объектах
			'@typescript-eslint/no-misused-promises': 'error', // Ловит неправильное использование Promise
		},
	},
]);
