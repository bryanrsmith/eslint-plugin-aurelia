
export function getInjectInfo(classDeclaration, sourceCode) {
	let members = classDeclaration.body.body;
	let ctor = members.find(isConstructor);

	let injects = [
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

function getInjectDecorator({ decorators = []}) {
	let node = decorators.find(d => d.expression.type === 'CallExpression' && d.expression.callee.name === injectIdentifierName);
	return node ? { type: 'decorator', node, deps: node.expression.arguments } : null;
}

function getInjectProperty(node, sourceCode) {
	let prop = node.body.body.find(x => isInjectProperty(x, sourceCode));
	return prop ? { type: 'property', node: prop, deps: prop.value.elements } : null;
}

function getInjectMethod(node) {
	let method = node.body.body.find(x => x.type === 'MethodDefinition' && x.static && x.key.name === injectIdentifierName);
	return method ? { type: 'method', node: method, deps: getMethodDeps(method) } : null;
}

function isInjectProperty(node, sourceCode) {
	if (node.type !== 'ClassProperty' || !node.static || node.value.type !== 'ArrayExpression') {
		return false;
	}

	let [ first, second ] = sourceCode.getFirstTokens(node, 2);
	let name = second.type === 'Identifier' ? second.value : first.value;

	return name === injectIdentifierName;
}

function getMethodDeps(method) {
	let body = method.value.body.body;
	if (body.length === 1 && body[0].type === 'ReturnStatement' && body[0].argument.type === 'ArrayExpression') {
		return body[0].argument.elements;
	}

	return null;
}
