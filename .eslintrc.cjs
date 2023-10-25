/*eslint-env node*/

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['next/core-web-vitals', 'prettier', 'airbnb', 'airbnb-typescript'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: ['./tsconfig.eslint.json'],
  },
  rules: {
    'import/prefer-default-export': 'off',

    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-throw-literal': 'off',
    '@typescript-eslint/no-implied-eval': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/default-param-last': 'off',

    'react/jsx-wrap-multilines': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/forbid-prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-curly-newline': 'off',
    'react/jsx-filename-extension': 'off',
    'react/require-default-props': 'off',
    'react/jsx-indent': 'off',
    'react/function-component-definition': 'off',

    // 'react-hooks/exhaustive-deps': 'off',

    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-autofocus': 'off',

    'no-throw-literal': 'off',
    'no-implied-eval': 'off',
    'no-useless-constructor': 'off',
    'jsx-quotes': 'off',
    'max-len': 'off',
    'operator-linebreak': 'off',
    'object-curly-newline': 'off',
    'no-confusing-arrow': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-plusplus': 'off',
    'no-nested-ternary': 'off',
    'no-console': 'off',
    'no-param-reassign': 'off',
    'function-paren-newline': 'off',
    'linebreak-style': 'off',
  },
};
