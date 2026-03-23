const globals = require('globals')
const tseslint = require('typescript-eslint')
const vueParser = require('vue-eslint-parser')
const _import = require('eslint-plugin-import')
const vue = require('eslint-plugin-vue')
const prettier = require('eslint-plugin-prettier')

const { fixupPluginRules } = require('@eslint/compat')

const js = require('@eslint/js')

module.exports = tseslint.config(
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'src/vite-env.d.ts', 'eslint.config.cjs'],
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  // Override parser for .vue files: vue-eslint-parser as outer, ts-eslint as inner
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      ecmaVersion: 2021,
      sourceType: 'module',
    },

    plugins: {
      import: fixupPluginRules(_import),
      prettier,
    },

    rules: {
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],

      'jsx-quotes': ['error', 'prefer-single'],
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-debugger': 'error',
      curly: ['error', 'multi'],
      eqeqeq: ['error', 'always'],
      '@typescript-eslint/explicit-function-return-type': 'off',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],

      'vue/no-mutating-props': 'error',
      'vue/no-unused-components': 'warn',
      'vue/no-unused-vars': [
        'warn',
        {
          ignorePattern: '^_',
        },
      ],
      'vue/no-v-html': 'warn',
      'vue/html-self-closing': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 4,
          },
          multiline: {
            max: 1,
          },
        },
      ],
    },

    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        },
      },
    },
  },
)
