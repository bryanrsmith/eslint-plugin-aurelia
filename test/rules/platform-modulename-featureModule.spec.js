// Tests for https://aurelia.io/docs/build-systems/webpack/a-basic-example#introduction

import eslint from 'eslint';
import rule from '../../src/rules/platform-modulename';

const ruleTester = new eslint.RuleTester({ parser: 'babel-eslint' });

const shouldEnableDebug = false;

// Use https://astexplorer.net/ and `espree` tokens to transform your `code`
// into an AST for use here.
ruleTester.run('platform-modulename', rule, {
	valid: [
		{
			options: [{ debug: shouldEnableDebug || true }],
			code: ` // A Feature Module index.js
  export function configure(config) {
    // Doesn't use PLATFORM.module()
    config.globalResources(['./my-component', './my-component-2', 'my-component-3', 'etc.']);
  }
`,
		},
	],
	invalid: [],
});
