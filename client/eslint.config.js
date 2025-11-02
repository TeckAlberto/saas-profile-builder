import js from '@eslint/js'
import globals from 'globals'
import react from '@eslint-react/eslint-plugin'
import reactHooks from 'eslint-plugin-react-hooks' // <-- ¡CORREGIDO!
import tseslint from 'typescript-eslint' // Usaremos esto como el constructor principal
import prettier from 'eslint-config-prettier'

// export default defineConfig([ ... ]) // Esta forma también es válida
// pero 'tseslint.config' es un ayudante recomendado
export default tseslint.config(
  // 1. Archivos ignorados globalmente
  {
    ignores: ['dist', 'node_modules', '**/*.cjs']
  },

  // 2. Aplicar las reglas recomendadas de JS
  js.configs.recommended,

  // 3. Aplicar las reglas recomendadas de TypeScript
  ...tseslint.configs.recommended,
  // ...tseslint.configs.recommendedTypeChecked, // <-- Si quieres reglas más estrictas (requiere 'project')

  // 4. Aplicar reglas de React
  {
    // APLICAR A ARCHIVOS JSX/TSX
    files: ['**/*.{jsx,tsx}'],
    // USAR LA CONFIGURACIÓN DEL NUEVO PAQUETE
    ...react.configs.recommended,
    settings: {
      react: {
        version: 'detect'
      }
    }
  },

  // 5. Aplicar reglas de React Hooks
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

  // 7. Esta es TU configuración personalizada (donde definimos el parser)
  // 7. Esta es TU configuración personalizada (donde definimos el parser)
  // Configuración para archivos JS/JSX (sin parserOptions.project)
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser // Añadir globales del navegador
      },
      parser: tseslint.parser, // tseslint.parser puede manejar JS
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off' // No se necesita importar React
    }
  },
  // Configuración para archivos TS/TSX (con parserOptions.project)
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser // Añadir globales del navegador
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off' // No se necesita importar React
    }
  },

  // 8. Aplicar Prettier (DEBE IR AL FINAL)
  prettier
)
