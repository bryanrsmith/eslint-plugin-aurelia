export default function noConsoleLogRule(context) {
	return {
		'MemberExpression'(node) {
			if (node.object.name === 'console' && disallowedConsoleMembers.indexOf(node.property.name) !== -1) {
				context.report(node, 'Unexpected console message. Use Aurelia\'s LogManager for logging.');
			}
		},
	};
}

const disallowedConsoleMembers = [ 'debug', 'log', 'info', 'warn', 'error' ];
