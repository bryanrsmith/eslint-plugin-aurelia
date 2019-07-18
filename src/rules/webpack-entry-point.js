const path = require('path');

/*
  Ensure that the `webpack.config.js` file correctly specifies the entry point
  as `aurelia-bootstrapper`.

  It expects the export to look something like this (exporting either a function or object)

   module.exports = function () {
     return {
       entry: {
         app: ['aurelia-bootstrapper']
       },
     }
   };
*/

const webpackConfigFileName = 'webpack.config.js';

const types = {
	ArrayExpression: 'ArrayExpression',
	AssignmentExpression: 'AssignmentExpression',
	BlockStatement: 'BlockStatement',
	ExpressionStatement: 'ExpressionStatement',
	FunctionExpression: 'FunctionExpression',
	Identifier: 'Identifier',
	MemberExpression: 'MemberExpression',
	ObjectExpression: 'ObjectExpression',
	Property: 'Property',
	ReturnStatement: 'ReturnStatement',
};

const isAssignedToModuleExports = context => {
	const ancestors = context.getAncestors();

	const appProperty = ancestors.pop();
	if (
		!appProperty ||
		appProperty.type !== types.Property ||
		appProperty.key.name !== 'app'
	) {
		// TODO: Remove Console
		// eslint-disable-next-line no-console
		console.log('Ignoring appProperty', appProperty);

		return false;
	}

	const entryObjectExpression = ancestors.pop();
	if (
		!entryObjectExpression ||
		entryObjectExpression.type !== types.ObjectExpression
	) {
		// TODO: Remove Console
		// eslint-disable-next-line no-console
		console.log('Ignoring entryObjectExpression', entryObjectExpression);
		return false;
	}

	const entryProperty = ancestors.pop();
	if (
		!entryProperty ||
		entryProperty.type !== types.Property ||
		entryProperty.key.name !== 'entry'
	) {
		// TODO: Remove Console
		// eslint-disable-next-line no-console
		console.log('Ignoring entryProperty', entryProperty);
		return false;
	}

	const objectExpression = ancestors.pop();
	if (!objectExpression || objectExpression.type !== types.ObjectExpression) {
		// TODO: Remove Console
		// eslint-disable-next-line no-console
		console.log('Ignoring objectExpression', objectExpression);
		return false;
	}

	// TODO Handle direct assignment rather than functions
	// TODO Handle arrow functions with body
	// TODO Handle arrow functions with ObjectExpressions
	const returnStatement = ancestors.pop();
	if (!returnStatement || returnStatement.type !== types.ReturnStatement) {
		// TODO: Remove Console
		// eslint-disable-next-line no-console
		console.log('Ignoring returnStatement', returnStatement);
		return false;
	}

	const blockStatement = ancestors.pop();
	if (!blockStatement || blockStatement.type !== types.BlockStatement) {
		// TODO: Remove Console
		// eslint-disable-next-line no-console
		console.log('Ignoring blockStatement', blockStatement);
		return false;
	}

	const functionExpression = ancestors.pop();
	if (
		!functionExpression ||
		functionExpression.type !== types.FunctionExpression
	) {
		// TODO: Remove Console
		// eslint-disable-next-line no-console
		console.log('Ignoring functionExpression', functionExpression);
		return false;
	}

	const assignmentExpression = ancestors.pop();
	if (
		!assignmentExpression ||
		assignmentExpression.type !== types.AssignmentExpression ||
		assignmentExpression.operator !== '='
	) {
		// TODO: Remove Console
		// eslint-disable-next-line no-console
		console.log('Ignoring assignmentExpression', assignmentExpression);
		return false;
	}

	const expressionStatement = ancestors.pop();
	if (
		!expressionStatement ||
		expressionStatement.type !== types.ExpressionStatement
	) {
		// TODO: Remove Console
		// eslint-disable-next-line no-console
		console.log('Ignoring expressionStatement', expressionStatement);
		return false;
	}

	const leftHandSideOfExpressionStatement = expressionStatement.expression.left;
	if (
		!leftHandSideOfExpressionStatement ||
		leftHandSideOfExpressionStatement.type !== types.MemberExpression
	) {
		// TODO: Remove Console
		// eslint-disable-next-line no-console
		console.log(
			'Ignoring leftHandSideOfExpressionStatement',
			leftHandSideOfExpressionStatement
		);
		return false;
	}

	const object = leftHandSideOfExpressionStatement.object;
	if (!object || object.type !== types.Identifier || object.name !== 'module') {
		// TODO: Remove Console
		// eslint-disable-next-line no-console
		console.log('Ignoring object', object);
		return false;
	}

	const property = leftHandSideOfExpressionStatement.property;
	if (
		!property ||
		property.type !== types.Identifier ||
		property.name !== 'exports'
	) {
		// TODO: Remove Console
		// eslint-disable-next-line no-console
		console.log('Ignoring property', property);
		return false;
	}

	return true;
};

const webpackEntryPointIsAureliaBootrap = context => node => {
	const basename = path.basename(context.getFilename());

	// Only webpack.config.js is checked
	if (basename !== webpackConfigFileName) {
		return;
	}

	if (node.name === 'app') {
		if (!isAssignedToModuleExports(context)) {
			return;
		}

		const parent = node.parent;
		const value = parent.value;
		if (value.type !== types.ArrayExpression) {
			context.report({
				node,
				message: 'entry.app must be an array of strings',
			});
			return;
		}
		const elements = value.elements;

		if (elements.length !== 1 || elements[0].value !== 'aurelia-bootstrapper') {
			context.report({
				node,
				message:
					"entry.app must be ['aurelia-bootstrapper']: found {{ value }}",
				data: {
					value: context.getSourceCode().getText(value),
				},
			});
			return;
		}
	}
};

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'TODO',
			category: 'aurelia',
			fixable: 'code',
		},
	},
	create: context => {
		// state here

		return {
			Identifier: webpackEntryPointIsAureliaBootrap(context),
		};
	},
};
