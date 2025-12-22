import js from '@eslint/js'
import globals from 'globals'
import react from '@eslint-react/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import pluginPrettier from 'eslint-plugin-prettier'

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules', '**/*.cjs']
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,
  {
    files: ['**/*.{jsx,tsx}'],
    ...react.configs.recommended,
    settings: {
      react: {
        version: 'detect'
      }
    }
  },

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  },

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off'
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off'
    }
  },
  {
    plugins: {
      prettier: pluginPrettier
    },
    rules: {
      'prettier/prettier': 'error'
    }
  },
  prettier
)
