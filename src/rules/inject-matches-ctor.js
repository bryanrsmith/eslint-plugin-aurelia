export default function injectMatchesCtorRule(context) {
	let classDeclarations = [];

	return {
		'ClassDeclaration'() {
			classDeclarations.unshift({});
		},

		'MethodDefinition'(node) {
			let classDeclaration = classDeclarations[0];

			if (node.kind === 'constructor') {
				classDeclaration.ctor = node;
			} else if (isInjectMethod(node)) {
				classDeclaration.injectMethod = node;
			}
		},

		'ArrayExpression'(node) {
			let classDeclaration = classDeclarations[0];
			if (!classDeclaration || classDeclaration.injectArray) {
				return;
			}

			let injectMethod = classDeclaration.injectMethod;
			if (injectMethod && context.getAncestors().indexOf(injectMethod) !== -1) {
				classDeclaration.injectArray = node;
			}
		},

		'ClassDeclaration:exit'(node) {
			let classDeclaration = classDeclarations.shift();
			let decorators = node.decorators || [];

			// check for inject decorators with no arguments
			let identifierInjectDecorator = getIdentifierInjectDecorator(decorators);
			if (identifierInjectDecorator) {
				context.report(identifierInjectDecorator, 'Expected arguments to inject.');
			}

			// find invoked inject decorators
			let injectDecorators = getInjectDecorators(decorators);
			let injectElements = injectDecorators.map(getInjectDecoratorInfo);

			// add static inject method if it was found during traversal
			if (classDeclaration.injectArray) {
				injectElements.push(getInjectMethodInfo(classDeclaration.injectArray, classDeclaration.injectMethod));
			}

			if (!injectElements.length) {
				return;
			}

			let [injectElement, ...rest] = injectElements;
			for (let duplicateInject of rest) {
				context.report(duplicateInject.node, 'Unexpected duplicate inject.');
			}

			let ctorParamsLength = classDeclaration.ctor.value.params.length;
			if (injectElement.deps.length !== ctorParamsLength) {
				context.report(injectElement.node, 'Constructor parameters do not match injected dependencies.');
			}
		}
	};
}

const injectIdentifierName = 'inject';

function getIdentifierInjectDecorator(decorators) {
	return decorators.find(d => d.expression.type === 'Identifier' && d.expression.name === injectIdentifierName);
}

function getInjectDecorators(decorators) {
	return decorators.filter(d => d.expression.type === 'CallExpression' && d.expression.callee.name === injectIdentifierName);
}

function getInjectDecoratorInfo(node) {
	return {
		deps: node.expression.arguments,
		node
	};
}

function getInjectMethodInfo(node, method) {
	return {
		deps: node.elements,
		node: method
	};
}

function isInjectMethod(node) {
	return node.kind === 'method' && node.static && node.key.name === injectIdentifierName;
}
