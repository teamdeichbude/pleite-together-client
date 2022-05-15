require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        // add more generic rulesets here, such as:
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        '@vue/eslint-config-typescript',
        'prettier',
    ],
    globals: {
        defineProps: 'readonly',
        defineEmits: 'readonly',
    },
    ignorePatterns: ['.eslintrc.js', 'vite.config.ts'],
    rules: {
        // override/add rules settings here, such as:
        'no-unused-vars': 'warn',
        curly: 'error',
        'no-nested-ternary': 'error',

        'vue/max-len': 'off',

        'max-len': [
            'warn',
            {
                code: 120,
                ignorePattern: '^\\s*import.*from',
                ignoreUrls: true,
            },
        ],
        'max-lines': ['warn', 2000],

        '@typescript-eslint/explicit-function-return-type': 'off', // disabled for .js file compatibility. gets enabled for .ts files in "overrides"-settings below.
        '@typescript-eslint/explicit-module-boundary-types': ['off'], // disabled for .js file compatibility. gets enabled for .ts files in "overrides"-settings below.
        '@typescript-eslint/no-non-null-assertion': ['off'],
        '@typescript-eslint/ban-ts-comment': ['off'],
        '@typescript-eslint/no-explicit-any': ['off'],
        '@typescript-eslint/no-inferrable-types': ['off'],

        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'default',
                format: ['camelCase'],
            },
            {
                selector: 'variable',
                format: ['camelCase'],
            },
            {
                selector: 'variable',
                modifiers: ['const'],
                format: ['UPPER_CASE', 'camelCase'],
            },
            {
                selector: 'classProperty',
                modifiers: ['readonly'],
                format: ['UPPER_CASE', 'camelCase'],
            },
            {
                selector: 'parameter',
                format: ['camelCase'],
                leadingUnderscore: 'forbid',
            },
            {
                selector: 'memberLike',
                modifiers: ['private'],
                format: ['camelCase'],
                leadingUnderscore: 'allow',
            },
            {
                selector: 'typeLike',
                format: ['PascalCase'],
            },
            {
                selector: 'class',
                format: ['PascalCase'],
            },
        ],

        semi: 'off',
        '@typescript-eslint/semi': ['off'],
    },
    overrides: [
        {
            // enable the rule specifically for TypeScript files
            files: ['*.ts', '*.tsx'],
            rules: {
                semi: 0,
                '@typescript-eslint/semi': ['warn'],

                '@typescript-eslint/no-unused-vars': ['warn'],
                '@typescript-eslint/explicit-module-boundary-types': [
                    'warn',
                    {
                        allowArgumentsExplicitlyTypedAsAny: true,
                    },
                ],
                '@typescript-eslint/explicit-function-return-type': ['error'],
            },
        },
        {
            files: ['*.vue'],
            rules: {
                'vue/component-definition-name-casing': ['warn', 'kebab-case'],
                'vue/component-name-in-template-casing': [
                    'warn',
                    'kebab-case',
                    {
                        registeredComponentsOnly: true,
                        ignores: [],
                    },
                ],
                'vue/no-v-html': ['off'],
                'vue/max-len': [
                    'warn',
                    {
                        code: 120,
                        template: 120,
                        tabWidth: 4,
                        comments: 120,
                        ignorePattern: '',
                        ignoreComments: false,
                        ignoreTrailingComments: true,
                        ignoreUrls: true,
                        ignoreStrings: true,
                        ignoreTemplateLiterals: true,
                        ignoreRegExpLiterals: false,
                        ignoreHTMLAttributeValues: true,
                        ignoreHTMLTextContents: true,
                    },
                ],
                '@typescript-eslint/naming-convention': [
                    'error',
                    {
                        selector: 'objectLiteralProperty',
                        format: ['PascalCase', 'camelCase', 'UPPER_CASE'],
                        // filter: {
                        //     regex: '^(pos_lat|pos_lon|max_distance)$', // this allows certain api var names to have special casing
                        //     match: false,
                        // },
                    },
                ],
            },
        },
    ],
};
