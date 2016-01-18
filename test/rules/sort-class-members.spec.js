import eslint from 'eslint';
import plugin from '../../src';

let ruleTester = new eslint.RuleTester({ parser: 'babel-eslint' });
let options = [{
	order: [ 'a', 'b' ],
}];

// rule logic isn't part of this project
// just do a quick check to make sure it's hooked up
ruleTester.run('sort-class-members', plugin.rules['sort-class-members'], {
	valid: [
		{ code: 'class Foo { a(){} b(){}}', options },
	],
	invalid: [
		{
			code: 'class Foo { b(){} a(){} }',
			errors: [
				{
					message: 'Expected method a to come before method b.',
					type: 'MethodDefinition',
				},
			],
			options,
		},
	],
});
