import oclif from 'eslint-config-oclif';
// const simpleImportSort = require('eslint-plugin-simple-import-sort');
// const oclif = require('eslint-config-oclif');
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  ...oclif,
  {
    ignores: [
      '**/dist',
      '/tmp',
    ],
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.js',
      '**/*.jsx',
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'comma-dangle': ['error', 'always-multiline'],
      'lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: true,
        },
      ],
      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
        },
      ],
      'no-trailing-spaces': [
        'error',
        {
          skipBlankLines: true,
        },
      ],
      'object-curly-spacing': ['error', 'always'],
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          next: 'return',
          prev: '*',
        },
        {
          blankLine: 'always',
          next: 'block',
          prev: '*',
        },
      ],
      quotes: ['error', 'single', { avoidEscape: true }],
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        asyncArrow: 'always',
        named: 'never',
      }],
      'space-in-parens': ['error', 'never'],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
