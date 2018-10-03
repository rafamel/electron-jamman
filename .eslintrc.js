const globals = require('eslint-restricted-globals');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: ['standard', 'plugin:import/errors', 'prettier'],
  env: {
    node: true,
    browser: true
  },
  parserOptions: {
    impliedStrict: true
  },
  plugins: ['prettier', 'import', 'babel'],
  globals: {},
  rules: {
    'no-warning-comments': [
      1,
      { terms: ['xxx', 'fixme', 'todo', 'refactor'], location: 'start' }
    ],
    'no-console': 1,
    'no-restricted-globals': [2, 'window', 'fetch'].concat(globals),
    // eslint-plugin-babel
    'babel/no-invalid-this': 1,
    'babel/semi': 1,
    // Prettier
    'prettier/prettier': [2, require('./.prettierrc')]
  },
  settings: {
    // babel-plugin-module-resolver
    'import/resolver': {
      'babel-module': {}
    }
  }
};
