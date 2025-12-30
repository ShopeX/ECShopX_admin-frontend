module.exports = {
  'root': true,
  'env': {
    'node': true
  },
  'extends': ['plugin:vue/essential', 'eslint:recommended', 'plugin:vue/recommended', 'prettier'],
  'parserOptions': {
    'parser': '@babel/eslint-parser'
  },
  'rules': {
    'vue/attributes-order': 0,
    'vue/component-tags-order': 0,
    'vue/html-closing-bracket-newline': 0,
    'vue/html-indent': 0,
    'vue/html-self-closing': 0,
    'vue/max-attributes-per-line': 0,
    'vue/no-dupe-keys': 0,
    'vue/no-lone-template': 0,
    'vue/no-unused-components': 0,
    'vue/no-v-html': 0,
    'vue/no-mutating-props': 0,
    'vue/order-in-components': 0,
    'vue/prop-name-casing': 0,
    'vue/require-default-prop': 0,
    'vue/require-v-for-key': 0,
    'vue/require-prop-types': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/this-in-template': 0,
    'vue/no-use-v-if-with-v-for': 0,
    'no-unused-vars': 0,
    'no-dupe-keys': 0,
    'no-undef': 0,
    'no-control-regex': 0,
    'no-useless-escape': 0,
    'vue/html-self-closing': [
      'error',
      {
        'html': {
          'void': 'never',
          'normal': 'always',
          'component': 'always'
        },
        'svg': 'always',
        'math': 'always'
      }
    ]
  }
}
