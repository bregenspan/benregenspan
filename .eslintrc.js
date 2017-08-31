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
    'promise',
    'prefer-object-spread'
  ],
  'rules': {
    'no-var': 'error',
    'prefer-object-spread/prefer-object-spread': 2,
    'semi': ['error', 'always']
  }
};
