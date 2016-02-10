import eslint from 'eslint';
import rule from '../../src/rules/store-unsubscribe';

let ruleTester = new eslint.RuleTester();

let options = [{
	setTimeout: false,
	setInterval: true,
	subscribe: true,
}];

ruleTester.run('store-unsubscribe', rule, {
	valid: [
		'var timer = setTimeout(x, 10)',
		'this.timer = setTimeout(x, 10)',
		'var interval = setInterval(x, 10)',
		'this.unsubscribe = this.eventAggregator.subscribe("foo", onMessage)',
		'this.unsubscribe = eventAggregator.subscribe("foo", onMessage)',
		'this.unsubscribe = ea.subscribe("foo", onMessage)',
		'subscribe("foo", onMessage)',
		'this.timer = setTimeout(x, 10)',
		'this.timer = window.setTimeout(x, 10)',
		'timers.push(setTimeout(x, 10))',
		'function test() { return setTimeout(x, 10); }',
		{ code: 'setTimeout(x, 10)', options },
		{ code: 'var interval = setInterval(x, 10)', options },
	],
	invalid: [
		{
			code: 'setTimeout(x, 10)',
			errors: [
				{
					message: 'Expected timer ID to be stored to allow cancellation.',
					type: 'CallExpression',
				},
			],
		},
		{
			code: 'window.setTimeout(x, 10)',
			errors: [
				{
					message: 'Expected timer ID to be stored to allow cancellation.',
					type: 'CallExpression',
				},
			],
		},
		{
			code: 'setInterval(x, 10)',
			errors: [
				{
					message: 'Expected interval ID to be stored to allow cancellation.',
					type: 'CallExpression',
				},
			],
		},
		{
			code: 'eventAggregator.subscribe("foo", onMessage)',
			errors: [
				{
					message: 'Expected unsubscribe function to be stored to allow subscription disposal.',
					type: 'CallExpression',
				},
			],
		},
		{
			code: 'setInterval(x, 10)',
			options,
			errors: [
				{
					message: 'Expected interval ID to be stored to allow cancellation.',
					type: 'CallExpression',
				},
			],
		},
	],
});
