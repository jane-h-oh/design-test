import js from '@eslint/js';
import polaris from '@polaris/lint';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '.next/**',
      'dist/**',
      'node_modules/**',
      'out/**',
      '*.cjs',
      'next-env.d.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...polaris.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@polaris/no-hardcoded-color': 'warn',
      '@polaris/no-arbitrary-tailwind': 'warn',
      '@polaris/no-direct-font-family': 'warn',
      '@polaris/prefer-polaris-component': 'warn',
    },
  },
];
