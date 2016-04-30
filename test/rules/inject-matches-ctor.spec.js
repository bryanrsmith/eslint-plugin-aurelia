import eslint from 'eslint';
import rule from '../../src/rules/inject-matches-ctor';

const ruleTester = new eslint.RuleTester({ parser: 'babel-eslint' });

ruleTester.run('inject-matches-ctor', rule, {
	valid: [
		'@inject(1) class Foo { constructor(a) {} }',
		'@inject(1) class Foo { constructor(a) {} } @inject(2) class Bar { constructor(b){} }',
		'class Foo { static inject() {return [1]; } constructor(a) {} }',
		'class Foo { static inject = [1]; constructor(a) {} }',
		'class Foo { inject = [1]; constructor() {} }',
	],
	invalid: [
		{
			code: '@inject(1) class Foo { constructor() {} }',
			errors: [{
				message: 'Constructor parameters do not match injected dependencies.',
				type: 'Decorator',
			}],
		},
		{
			code: 'class Foo { static inject() { return [1]; } constructor(a, b) {} }',
			errors: [{
				message: 'Constructor parameters do not match injected dependencies.',
				type: 'MethodDefinition',
			}],
		},
		{
			code: 'class Foo { static inject = [1]; constructor(a, b) {} }',
			errors: [{
				message: 'Constructor parameters do not match injected dependencies.',
				type: 'ClassProperty',
			}],
		},
		{
			code: '@inject() class Foo { static inject() { return [1]; } constructor() {} }',
			errors: [{
				message: 'Unexpected duplicate inject.',
				type: 'MethodDefinition',
			}],
		},
	],
});
