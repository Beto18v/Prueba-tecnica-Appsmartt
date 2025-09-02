module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'warn',
  },
  env: {
    node: true,
    browser: true,
    es2022: true,
    jest: true,
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/', '*.js', '*.d.ts'],
};
