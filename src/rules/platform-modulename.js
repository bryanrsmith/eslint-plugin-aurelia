/*
  Ensure that module usage is wrapped in `PLATFORM.moduleName()`.
*/

const { types } = require('./eslint-types');

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

		const calleeObjectIsAureliaUse = callee => {
			if (callee.type !== types.MemberExpression) {
				// TODO: Remove Console
				// eslint-disable-next-line no-console
				console.log('Ignoring callee', callee);

				return false;
			}

			const object = callee.object;
			if (!object) {
				// TODO: Remove Console
				// eslint-disable-next-line no-console
				console.log('Ignoring undefined object in callee', callee);

				return false;
			}

			if (object.type === types.Identifier && object.name !== 'use') {
				// TODO: Remove Console
				// eslint-disable-next-line no-console
				console.log('Ignoring object', object);

				return false;
			}

			return true;
		};

		const checkGlobalResources = callExpression => {
			// https://aurelia.io/docs/api/framework/class/FrameworkConfiguration/method/globalResources
			const callExpressionArguments = callExpression.arguments;

			// TODO: Handle non-array arguments
			if (callExpressionArguments.length !== 1) {
				// TODO: Remove Console
				// eslint-disable-next-line no-console
				console.log('Ignoring incorrect number of arguments', arguments);

				return false;
			}

			const arg = callExpressionArguments[0];
			let globalResources = [arg]; // unify to array: use.globalResource(resource) => use.globalResource([resource])
			if (arg.type === types.ArrayExpression) {
				globalResources = arg.elements;
			}

			globalResources
				.filter(
					globalResource =>
						globalResource.type !== types.CallExpression ||
						(globalResource.callee.object.name !== 'PLATFORM' &&
							globalResource.callee.property.name !== 'moduleName')
				)
				.map(globalResource =>
					context.report(
						globalResource,
						"use.globalResources must wrap modules with 'PLATFORM.moduleName()'"
					)
				);
		};

		const usesPlatformModuleName = node => {
			const callee = node.callee;

			if (
				callee.property.name === 'globalResources' &&
				calleeObjectIsAureliaUse(callee)
			) {
				checkGlobalResources(node);
				return;
			}

			return;
		};

		return {
			CallExpression: usesPlatformModuleName,
		};
	},
};
