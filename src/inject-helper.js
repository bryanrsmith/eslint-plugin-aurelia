
export function getInjectInfo(classDeclaration, sourceCode) {
	const members = classDeclaration.body.body;
	const ctor = members.find(isConstructor);

	const injects = [
		getInjectDecorator(classDeclaration),
		getInjectProperty(classDeclaration, sourceCode),
		getInjectMethod(classDeclaration),
	].filter(x => x);

	return {
		ctor: {
			node: ctor,
			params: ctor.value.params,
		},
		injects,
	};
}

const injectIdentifierName = 'inject';

function isConstructor(member) {
	return member.type === 'MethodDefinition' && member.key.name === 'constructor';
}

function getInjectDecorator({ decorators = [] }) {
	const node = decorators.find(d => d.expression.type === 'CallExpression' && d.expression.callee.name === injectIdentifierName);
	return node ? { type: 'decorator', node, deps: node.expression.arguments } : null;
}

function getInjectProperty(node, sourceCode) {
	const prop = node.body.body.find(x => isInjectProperty(x, sourceCode));
	return prop ? { type: 'property', node: prop, deps: prop.value.elements } : null;
}

function getInjectMethod(node) {
	const method = node.body.body.find(x => x.type === 'MethodDefinition' && x.static && x.key.name === injectIdentifierName);
	return method ? { type: 'method', node: method, deps: getMethodDeps(method) } : null;
}

function isInjectProperty(node, sourceCode) {
	if (node.type !== 'ClassProperty' || !node.static || node.value.type !== 'ArrayExpression') {
		return false;
	}

	const [ first, second ] = sourceCode.getFirstTokens(node, 2);
	const name = second.type === 'Identifier' ? second.value : first.value;

	return name === injectIdentifierName;
}

function getMethodDeps(method) {
	const body = method.value.body.body;
	if (body.length === 1 && body[0].type === 'ReturnStatement' && body[0].argument.type === 'ArrayExpression') {
		return body[0].argument.elements;
	}

	return null;
}
