import vuetify from 'eslint-config-vuetify'

export default [
  ...vuetify,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/*.d.ts',
      'auto-imports.d.ts',
      'components.d.ts',
      'typed-router.d.ts',
    ],
  },
]
