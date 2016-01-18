export default function noConventionsRule(context) {
	return {
		'ClassDeclaration'(node) {
			let convention = conventions.find(c => node.id.name.endsWith(c.suffix));
			if (!convention) {
				return;
			}

			let decorators = node.decorators || [];

			let isUsingConvention = !decorators.some(d => {
				return d.expression.type === 'CallExpression'
					&& d.expression.callee.name === convention.decorator;
			});

			if (isUsingConvention) {
				context.report(node, 'Expected class to declare its resource type with a decorator.');
			}
		},
	};
}

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
