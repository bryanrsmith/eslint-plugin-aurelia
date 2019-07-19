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
  aurelia.use.globalResources( // single element
    PLATFORM.moduleName('./my-custom-element') // OK
  )
}
`,
		},
		{
			options: [{ debug: shouldEnableDebug }],
			code: `
export function configure(aurelia) {
  aurelia.use.globalResources([ // array of one
    PLATFORM.moduleName('./my-custom-element') // OK
  ])
}
`,
		},
		{
			options: [{ debug: shouldEnableDebug }],
			code: `
export function configure(au) {
  au.use.globalResources([
    PLATFORM.moduleName('./my-custom-element1'), // OK
    PLATFORM.moduleName('./my-custom-element2'), // OK
    PLATFORM.moduleName('./my-custom-element3'), // OK
  ])
}
`,
		},
	],
	invalid: [
		{
			options: [{ debug: shouldEnableDebug }],
			code: `
export function configure(aurelia) {
  aurelia.use.globalResources(
    './my-custom-element' // WRONG
  )
}
`,
			errors: [
				{
					message:
						"use.globalResources must wrap modules with 'PLATFORM.moduleName()'",
					type: 'Literal',
					line: 4,
					column: 5,
				},
			],
		},
		{
			options: [{ debug: shouldEnableDebug }],
			code: `
export function configure(aurelia) {
  aurelia.use.globalResources([
    './my-custom-element' // WRONG
  ])
}
`,
			errors: [
				{
					message:
						"use.globalResources must wrap modules with 'PLATFORM.moduleName()'",
					type: 'Literal',
					line: 4,
					column: 5,
				},
			],
		},
		{
			options: [{ debug: shouldEnableDebug }],
			code: `
export function configure(au) {
  au.use.globalResources([
    PLATFORM.moduleName('./my-custom-element1'), // OK
    './my-custom-element2', // WRONG
    PLATFORM.moduleName('./my-custom-element3'), // OK
  ])
}
`,
			errors: [
				{
					message:
						"use.globalResources must wrap modules with 'PLATFORM.moduleName()'",
					type: 'Literal',
					line: 5,
					column: 5,
				},
			],
		},
		{
			options: [{ debug: shouldEnableDebug }],
			code: `
export function configure(aurelia) {
  aurelia.use.globalResources([
    './my-custom-element1', // WRONG
    './my-custom-element2', // WRONG
    './my-custom-element3', // WRONG
  ])
}`,
			errors: [
				{
					message:
						"use.globalResources must wrap modules with 'PLATFORM.moduleName()'",
					type: 'Literal',
					line: 4,
					column: 5,
				},
				{
					message:
						"use.globalResources must wrap modules with 'PLATFORM.moduleName()'",
					type: 'Literal',
					line: 5,
					column: 5,
				},
				{
					message:
						"use.globalResources must wrap modules with 'PLATFORM.moduleName()'",
					type: 'Literal',
					line: 6,
					column: 5,
				},
			],
		},
	],
});
