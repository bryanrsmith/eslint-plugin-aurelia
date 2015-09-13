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
        "aurelia/no-conventions": 0
    }
}
```

# List of supported rules

* `inject-matches-ctor`: Verify that inject decorators and static methods declare the same number of dependencies as the class constructor accepts
* `no-conventions`: Disallow classes from relying on Aurelia's naming conventions (e.g., `FooCustomAttribute`) without explicitly declaring resource types with decorators