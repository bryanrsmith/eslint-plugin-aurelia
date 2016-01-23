[![build status][travis-image]][travis-url]
[![test coverage][coveralls-image]][coveralls-url]
[![npm][npm-image]][npm-url]

# eslint-plugin-aurelia

ESLint rules for Aurelia projects.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-aurelia`:

```
$ npm install eslint-plugin-aurelia --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-aurelia` globally.

## Usage

Add `aurelia` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "aurelia"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "aurelia/inject-matches-ctor": 2,
        "aurelia/no-conventions": 0,
        "aurelia/no-console-log": 0,
        "aurelia/sort-class-members": [0, {
            "order": [
                { "name": "metadata", "type": "method", "static": true },
                "[static-properties]",
                "[static-methods]",
                "[properties]",
                { "name": "inject", "static": true },
                "constructor",
                "[everything-else]",
                "[lifecycle]",
            ]
        }]
    }
}
```

# List of supported rules

### `inject-matches-ctor`
Verify that inject decorators declare the same number of dependencies as the class constructor accepts.

### `no-conventions`
Disallow classes from relying on Aurelia's naming conventions (e.g., `FooCustomAttribute`) without explicitly declaring resource types with decorators. It is recommended to avoid relying on naming conventions in library code because a consuming application may change those conventions.

### `no-console-log`
Suggest that logging code use Aurelia's `LogManager` instead of console methods.

### `sort-class-members`
Enforce consistent ordering of class properties and methods.
This rule delegates to the [`eslint-plugin-sort-class-members`](https://github.com/bryanrsmith/eslint-plugin-sort-class-members) plugin. Please refer to the documentation for that package for configuration information.
This rule also provides the following groups available for sort order options:

* `[lifecycle]`: matches Aurelia component and router lifecycle methods in the order in which they occur. E.g., `bind` must come before `deactivate`.
* `[component-lifecycle]`: matches Aurelia component lifecycle methods in the order in which they occur
* `[router-lifecycle]`: matches Aurelia router lifecycle methods in the order in which they occur

[travis-image]: https://img.shields.io/travis/bryanrsmith/eslint-plugin-aurelia/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/bryanrsmith/eslint-plugin-aurelia
[coveralls-image]: https://img.shields.io/coveralls/bryanrsmith/eslint-plugin-aurelia/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/bryanrsmith/eslint-plugin-aurelia?branch=master
[npm-image]: https://img.shields.io/npm/v/eslint-plugin-aurelia.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/eslint-plugin-aurelia
