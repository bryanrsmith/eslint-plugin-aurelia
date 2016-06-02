import eslint from 'eslint';
import rule from '../../src/rules/inject-type';

const ruleTester = new eslint.RuleTester({ parser: 'babel-eslint' });

ruleTester.run('inject-type', rule, {
	valid: [
		{ code: 'class Foo { constructor(a) {} }', options: [ 'decorator' ] },
		{ code: '@inject(1) class Foo { constructor(a) {} }', options: [ 'decorator' ] },
		{ code: '@inject(1) class Foo { constructor(a) {} } @inject(2) class Bar { constructor(b){} }', options: [ 'decorator' ] },
		{ code: 'class Foo { static inject() {return [1]; } constructor(a) {} }', options: [ 'method' ] },
		{ code: 'class Foo { static inject = [1]; constructor(a) {} }', options: [ 'property' ] },
		{ code: 'class Foo {}', options: [ 'property' ] },
	],
	invalid: [
		{
			code: '@inject(1) class Foo { constructor(a) {} }',
			errors: [{
				message: 'Expected injected dependencies to be declared with a property.',
				type: [ 'Decorator' ],
			}],
			options: [ 'property' ],
		},
		{
			code: 'class Foo { static inject() { return [1]; } constructor(a) {} }',
			errors: [{
				message: 'Expected injected dependencies to be declared with a decorator.',
				type: 'MethodDefinition',
			}],
			options: [ 'decorator' ],
		},
		{
			code: 'class Foo { static inject = [1]; constructor(a) {} }',
			errors: [{
				message: 'Expected injected dependencies to be declared with a method.',
				type: 'ClassProperty',
			}],
			options: [ 'method' ],
		},
	],
});
