/*
  Ensure that module usage is wrapped in `PLATFORM.moduleName()`.
*/

const { types } = require('./eslint-types');

const calleeObjectIsAureliaUse = node => {
	if (node.type !== types.MemberExpression) {
		// TODO: Remove Console
		// eslint-disable-next-line no-console
		console.log('Ignoring node', node);

		return false;
	}

	const useObject = node.property;

	if (useObject.type !== types.Identifier && useObject.name !== 'use') {
		// TODO: Remove Console
		// eslint-disable-next-line no-console
		console.log('Ignoring useObject', useObject);

		return false;
	}

	return true;
};

const checkGlobalResources = context => node => {
	// https://aurelia.io/docs/api/framework/class/FrameworkConfiguration/method/globalResources
	const nodeArguments = node.arguments;

	// TODO: Handle non-array arguments
	if (
		nodeArguments.length !== 1 &&
		nodeArguments[0].type === types.ArrayExpression
	) {
		// TODO: Remove Console
		// eslint-disable-next-line no-console
		console.log('Ignoring arguments', arguments);

		return false;
	}

	const elements = nodeArguments[0].elements;
	elements
		.filter(
			element =>
				element.type !== types.CallExpression ||
				(element.callee.object.name !== 'PLATFORM' &&
					element.callee.property.name !== 'moduleName')
		)
		.map(element =>
			context.report(
				element,
				"use.globalResources must wrap modules with 'PLATFORM.moduleName()'"
			)
		);
};

const usesPlatformModuleName = context => node => {
	const callee = node.callee;

	if (
		callee.property.name === 'globalResources' &&
		calleeObjectIsAureliaUse(callee)
	) {
		checkGlobalResources(context)(node);
		return;
	}

	return;
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
			CallExpression: usesPlatformModuleName(context),
		};
	},
};
