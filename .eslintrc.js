module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'standard',
    'prettier'
  ],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    "prettier/prettier": "error",
    "quotes": ["error", "single"],
    "object-curly-spacing": [2, "always"],
    "semi": [2, "never"],
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }]
  }
}
