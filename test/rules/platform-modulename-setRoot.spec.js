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
			options: [{ debug: shouldEnableDebug }],
			code: `
export function configure(aurelia) {
  aurelia.setRoot(PLATFORM.moduleName('app')) // OK
}
`,
		},
		{
			options: [{ debug: shouldEnableDebug }],
			code: `
export function configure(aurelia) {
  // ignored as not calling on aurelia parameter
  notAurelia.setRoot('app') // OK
}
`,
		},
		{
			options: [{ debug: shouldEnableDebug }],
			code: `
  // ignored as not calling from within configure
  aurelia.setRoot('app') // OK
`,
		},
	],
	invalid: [
		{
			options: [{ debug: shouldEnableDebug }],
			code: `
export function configure(aurelia) {
  aurelia.setRoot('app') // WRONG
}
`,
			errors: [
				{
					message: "setRoot must wrap modules with 'PLATFORM.moduleName()'",
					type: 'Literal',
					line: 3,
					column: 19,
				},
			],
		},
	],
});
