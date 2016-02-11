export default function storeUnsubscribeRule(context) {
	let options = {
		setTimeout: true,
		setInterval: true,
		subscribe: true,
		...context.options[0],
	};

	return {
		'CallExpression'(node) {
			let info = getCallInfo(node);
			if (shouldCheckCall(info, options) && !isParentAcceptable(node)) {
				context.report(node, messages[info.name]);
			}
		},
	};
}

function getCallInfo(node) {
	let callee = node.callee;
	let isMemberExpression = callee.type === 'MemberExpression';
	let identifier = isMemberExpression ? callee.property : callee;

	return {
		node,
		isMemberExpression,
		name: identifier.name,
		objectName: isMemberExpression ? callee.object.name	: null,
	};
}

function shouldCheckCall({ name, isMemberExpression }, options) {
	return (
		(name === 'setTimeout' && options.setTimeout) ||
		(name === 'setInterval' && options.setInterval) ||
		(name === 'subscribe' && isMemberExpression && options.subscribe)
	);
}

function isParentAcceptable({ parent }) {
	return acceptableParentTypes.indexOf(parent.type) !== -1;
}

const acceptableParentTypes = [
	'VariableDeclarator',
	'AssignmentExpression',
	'ReturnStatement',
	'CallExpression',
];

const messages = {
	'setTimeout': 'Expected timer ID to be stored to allow cancellation.',
	'setInterval': 'Expected interval ID to be stored to allow cancellation.',
	'subscribe': 'Expected unsubscribe function to be stored to allow subscription disposal.',
};
