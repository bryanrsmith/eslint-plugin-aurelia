export default function noConventionsRule(context) {
	return {
		'ClassDeclaration'(node) {
			const convention = conventions.find(c => node.id.name.endsWith(c.suffix));
			if (!convention) {
				return;
			}

			const decorators = node.decorators || [];

			const isUsingConvention = !decorators.some(d =>
				d.expression.type === 'CallExpression' &&
				d.expression.callee.name === convention.decorator
			);

			if (isUsingConvention) {
				context.report(node, 'Expected class to declare its resource type with a decorator.');
			}
		},
	};
}

noConventionsRule.schema = [];

const conventions = [{
	suffix: 'CustomElement',
	decorator: 'customElement',
}, {
	suffix: 'CustomAttribute',
	decorator: 'customAttribute',
}, {
	suffix: 'ValueConverter',
	decorator: 'valueConverter',
}];
