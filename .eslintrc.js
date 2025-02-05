module.exports = {
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'validate-filename'],
  root: true,
  rules: {
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'validate-filename/naming-rules': [
      'error',
      {
        rules: [
          {
            case: 'pascal',
            target: '**/components/**',
          },
          {
            case: 'kebab',
            target: '**/app/**',
            patterns: '^(page|layout|loading|error|not-found|route|template).tsx$',
          },
        ],
      },
    ],
  },
};
