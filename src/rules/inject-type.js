import { getInjectInfo } from '../inject-helper';

export default function injectTypeRule(context) {
	const type = context.options[0];

	return {
		'ClassDeclaration'(node) {
			const injectInfo = getInjectInfo(node, context.getSourceCode());

			if (!injectInfo.injects.length) {
				return;
			}

			const inject = injectInfo.injects[0];
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
