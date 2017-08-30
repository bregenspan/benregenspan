/**
 * Standard.js + extra strictness and semicolons
 */

module.exports = {
  'root': true,
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': 'standard',
  'parser': 'babel-eslint',
  'plugins': [
    'standard',
    'promise'
  ],
  'rules': {
    'semi': ['error', 'always'],
    'no-var': 'error'
  }
};
