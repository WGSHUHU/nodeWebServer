module.exports = {
  extends: ['eslint:recommended'],
  rules: {
    'no-console': [
      'error',
      {
        allow: ['warn', 'info', 'error']
      }
    ]
  },
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'script'
  },
  env: {
    node: true,
    es6: true
  }
}
