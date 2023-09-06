/** @type {import("eslint").Linter.Config} */
const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true
  },
  plugins: ['@typescript-eslint', 'tailwindcss', '@tanstack/query'],
  extends: [
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended-type-checked',
    'prettier',
    'plugin:tailwindcss/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended'
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports'
      }
    ],
    '@typescript-eslint/no-unsafe-member-access': ['warn'],
    '@typescript-eslint/no-unsafe-assignment': ['warn'],
    '@typescript-eslint/ban-ts-comment': ['warn'],

    // '@typescript-eslint/no-unsafe-return': ['warn'],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@tanstack/query/exhaustive-deps': 'error',
    '@tanstack/query/prefer-query-object-syntax': 'error'
  },
  settings: {
    tailwindcss: {
      callees: ['cn'],
      config: './tailwind.config.ts'
    },
    next: {
      rootDir: ['./']
    }
  }
}

module.exports = config
