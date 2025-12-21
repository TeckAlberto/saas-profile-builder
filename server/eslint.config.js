import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginImport from 'eslint-plugin-import'
import configPrettier from 'eslint-config-prettier'
import pluginPrettier from 'eslint-plugin-prettier'
import globals from 'globals'

export default tseslint.config(
  eslint.configs.recommended,

  ...tseslint.configs.recommendedTypeChecked,

  {
    plugins: { import: pluginImport },
    rules: {
      ...pluginImport.configs.recommended.rules,
      ...pluginImport.configs.typescript.rules,
      '@typescript-eslint/no-misused-promises': 'off'
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true
      }
    }
  },

  configPrettier,

  {
    files: ['src/**/*.{ts,js}', 'test/**/*.ts', 'scripts/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022
      },
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      prettier: pluginPrettier
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always'
        }
      ]
    }
  },

  {
    ignores: ['dist/', 'node_modules/', '*.config.js', '*.config.ts', 'coverage/']
  }
)
