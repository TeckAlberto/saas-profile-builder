import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    /**
     * Establece el entorno de prueba como 'node'.
     * Esto es crucial para probar código de backend y
     * le dice a Vitest que no intente usar un DOM de navegador.
     */
    environment: 'node',

    /**
     * Habilita los 'globals' (describe, it, expect, vi)
     * para que no tengas que importarlos en cada archivo de test.
     */
    globals: true,

    /**
     * ¡AQUÍ ESTÁ EL CAMBIO!
     * Especifica dónde buscará Vitest los archivos de test.
     * Por defecto, busca en todos lados. Al mover tus tests
     * a una carpeta `tests/` en la raíz (hermana de `src`),
     * es una buena práctica indicarlo explícitamente.
     */
    include: ['test/**/*.{test,spec}.ts']

    /**
     * Opcional: Aumenta el timeout si tus tests de integración
     * (incluso los simulados) tardan un poco más.
     */
    // testTimeout: 10000,
  }
})
