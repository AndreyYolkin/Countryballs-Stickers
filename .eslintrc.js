module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
  },

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2020
  },

  // add your custom rules here
  rules: {
    semi: ['error', 'never'],
    camelcase: 'off',
    'import/no-cycle': 'off',
    'no-param-reassign': 'off',
    'comma-dangle': 'off',
    'arrow-parens': 'off',
    'space-before-function-paren': 'off',
    'max-len': ['error', { code: 120, ignoreStrings: true, ignoreRegExpLiterals: true }],
    'require-jsdoc': 'off',
    'no-plusplus': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/comment-directive': 'off',
    'vue/no-v-html': 'off'
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}
