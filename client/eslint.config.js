import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignorar build y dependencias
  globalIgnores(['dist', 'node_modules']),

  {
    files: ['**/*.{ts,tsx,jsx,js}'],

    // Configuraciones base
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      prettier // Desactiva reglas en conflicto con Prettier
    ],

    settings: {
      react: {
        version: 'detect'
      }
    },

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
          tsx: true
        }
      }
    },

    plugins: {
      react,
      'react-hooks': reactHooks
    },

    rules: {
      'react/react-in-jsx-scope': 'off', // No es necesario import React en Vite + TSX
      'react-refresh/only-export-components': 'warn'
    }
  }
])
