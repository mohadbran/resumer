import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },

  {
    files: ['src/server-data/**/*.js'],

    languageOptions: {
        globals: {
            ContentService: 'readonly',
            SpreadsheetApp: 'readonly',
            DocumentApp: 'readonly',
            DriveApp: 'readonly',
            Logger: 'readonly',
        },
    },

    rules: {
        'no-unused-vars': [
            'error',
            {
                varsIgnorePattern:
                    '^(doGet|testGenerateResume)$',
            },
        ],
    },
  },
])
