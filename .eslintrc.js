module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true
  },
  extends: ['prettier/react', 'prettier/@typescript-eslint'],
  plugins: ['prettier', '@typescript-eslint', 'eslint-comments', 'react-hooks'],
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
      legacyDecorators: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        tabWidth: 2,
        singleQuote: true
      }
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'off',
      { allowTypedFunctionExpressions: true }
    ],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true, typedefs: true }
    ],
    '@typescript-eslint/no-var-requires': 0,
    'unicorn/prevent-abbreviations': 'off',
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    'no-useless-escape': 0,
    'no-console': 'warn',
    'prefer-promise-reject-errors': 0,
    'generator-star-spacing': 'off',
    'promise/param-names': 0,
    'no-template-curly-in-string': 0,
    'no-return-await': 0,
    'default-case': 'error',
    'lines-between-class-members': 0,
    'no-script-url': 0,
    'no-eval': 0,
    'no-implicit-dependencies': 0,
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'react-hooks/exhaustive-deps': 'warn' // 检查 effect 的依赖
  }
};
