import eslint from 'eslint';
import rule from '../../src/rules/inject';

let ruleTester = new eslint.RuleTester({ parser: 'babel-eslint' });

ruleTester.run('inject', rule, {
	valid: [
		'@inject(1) class Foo { constructor(a) {} }',
		'@inject(1) class Foo { constructor(a) {} } @inject(2) class Bar { constructor(b){} }',
		'class Foo { static inject() {return [1]; } constructor(a) {} }',
		'class Foo { static other() {return [1]; } constructor() {} }'
	],
	invalid: [
		{
			code: '@inject(1) class Foo { constructor() {} }',
			errors: [
				{
					message: 'Constructor parameters do not match injected dependencies.',
					type: 'Decorator'
				}
			]
		},
		{
			code: 'class Foo { static inject() { return [1]; } constructor(a, b) {} }',
			errors: [
				{
					message: 'Constructor parameters do not match injected dependencies.',
					type: 'MethodDefinition'
				}
			]
		},
		{
			code: '@inject class Foo { constructor() {} }',
			errors: [{
				message: 'Expected arguments to inject.',
				type: 'Decorator'
			}]
		},
		{
			code: '@inject() @inject() class Foo { constructor() {} }',
			errors: [{
					message: 'Unexpected duplicate inject.',
					type: 'Decorator'
				}
			]
		},
		{
			code: '@inject() class Foo { static inject() { return [1]; } constructor() {} }',
			errors: [{
					message: 'Unexpected duplicate inject.',
					type: 'MethodDefinition'
				}
			]
		}
	]
});
