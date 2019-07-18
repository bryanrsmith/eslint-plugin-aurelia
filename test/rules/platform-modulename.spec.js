// Tests for https://aurelia.io/docs/build-systems/webpack/a-basic-example#introduction

import eslint from 'eslint';
import rule from '../../src/rules/platform-modulename';

const ruleTester = new eslint.RuleTester({ parser: 'babel-eslint' });

// Use https://astexplorer.net/ and `espree` tokens to transform your `code`
// into an AST for use here.
ruleTester.run('platform-modulename', rule, {
	valid: [
		`
  aurelia.use.globalResources([
    PLATFORM.moduleName('./my-custom-element') // OK
  ])`,
	],
	invalid: [
		{
			code: `
  aurelia.use.globalResources([
    './my-custom-element' // WRONG
  ])`,
			errors: [
				{
					message:
						"use.globalResources must wrap modules with 'PLATFORM.moduleName()'",
					type: 'Literal',
				},
			],
		},
	],
});
