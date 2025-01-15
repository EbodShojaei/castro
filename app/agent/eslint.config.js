import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

export default [
    {
        // TypeScript configuration
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            'unused-imports': unusedImportsPlugin,
            'prettier': prettierPlugin,
        },
        rules: {
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
            ],
            'semi': 'off', // Disable any rule conflicting with Prettier
            'prettier/prettier': 'error', // Ensure Prettier runs as an ESLint rule
            '@typescript-eslint/no-unused-vars': ['warn'],  // TypeScript specific rule
            '@typescript-eslint/explicit-module-boundary-types': 'off',  // Optional TypeScript rule
        },
        settings: {
            "import/resolver": {
                typescript: {
                    project: "./tsconfig.json",
                },
            },
        },
    }
];
