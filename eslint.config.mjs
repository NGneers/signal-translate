import { defineConfig } from 'eslint/config';
import ngneers from '@ngneers/eslint-config-angular';
import globals from 'globals';

export default defineConfig([
  ngneers.configs.angular,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
]);
