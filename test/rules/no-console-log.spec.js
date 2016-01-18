import eslint from 'eslint';
import rule from '../../src/rules/no-console-log';

let ruleTester = new eslint.RuleTester({ parser: 'babel-eslint' });

ruleTester.run('no-console-log', rule, {
	valid: [
		'LogManager.log("test")',
		'console.dir({})',
	],
	invalid: [
		{
			code: 'console.log("test")',
			errors: [
				{
					message: 'Unexpected console message. Use Aurelia\'s LogManager for logging.',
					type: 'MemberExpression',
				},
			],
		},
		{
			code: 'console.error.bind(console)',
			errors: [
				{
					message: 'Unexpected console message. Use Aurelia\'s LogManager for logging.',
					type: 'MemberExpression',
				},
			],
		},
	],
});
