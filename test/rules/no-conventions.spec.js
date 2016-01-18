import eslint from 'eslint';
import rule from '../../src/rules/no-conventions';

let ruleTester = new eslint.RuleTester({ parser: 'babel-eslint' });

ruleTester.run('no-conventions', rule, {
	valid: [
		'@customAttribute("fancy") class FancyCustomAttribute {}',
		'class Fancy {}',
	],
	invalid: [
		{
			code: 'class FancyCustomAttribute {}',
			errors: [
				{
					message: 'Expected class to declare its resource type with a decorator.',
					type: 'ClassDeclaration',
				},
			],
		},
		{
			code: '@customAElement("fancy") class FancyCustomAttribute {}',
			errors: [
				{
					message: 'Expected class to declare its resource type with a decorator.',
					type: 'ClassDeclaration',
				},
			],
		},
	],
});
