import { getInjectInfo } from '../inject-helper';

export default function injectTypeRule(context) {
	let type = context.options[0];

	return {
		'ClassDeclaration'(node) {
			let injectInfo = getInjectInfo(node, context.getSourceCode());

			if (!injectInfo.injects.length) {
				return;
			}

			let inject = injectInfo.injects[0];
			if (inject.type !== type) {
				context.report(inject.node, `Expected injected dependencies to be declared with a ${type}.`);
			}
		},
	};
}

injectTypeRule.schema = [
	{
		enum: [ 'property', 'method', 'decorator' ],
	},
];
