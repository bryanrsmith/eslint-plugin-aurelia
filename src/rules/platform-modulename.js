/*
  Ensure that module usage is wrapped in `PLATFORM.moduleName()`.
*/

const { types } = require('./eslint-types');

module.exports = {
	meta: {
		type: 'problem',
		docs: {
			description: 'Enforce wrapping of module name in PLATFORM.moduleName()',
			category: 'aurelia',
		},
		fixable: 'code',
		schema: [
			{
				type: 'object',
				properties: {
					debug: {
						type: 'boolean',
					},
				},
				additionalProperties: false,
			},
		],
	},
	create: context => {
		let aureliaParameter;
		let isDebugEnabled = false;

		if (context.options && context.options.length >= 1) {
			isDebugEnabled = context.options[0].debug;
		}

		const logDebug = (...args) => {
			if (isDebugEnabled) {
				console.log('DEBUG: ', args);
			}
		};

		const captureAureliaConfigure = exportNamedDeclaration => {
			const functionDeclaration = exportNamedDeclaration.declaration;
			if (functionDeclaration.type !== types.FunctionDeclaration) {
				logDebug('Ignoring exportNamedDeclaration', exportNamedDeclaration);

				return;
			}

			if (
				!functionDeclaration.id ||
				functionDeclaration.id.name !== 'configure'
			) {
				logDebug('Ignoring non "configure" function', functionDeclaration);

				return;
			}

			const params = functionDeclaration.params;
			if (params.length !== 1) {
				logDebug(
					'Ignoring "configure" function with incorrect params',
					functionDeclaration
				);

				return;
			}

			aureliaParameter = params[0];
		};

		const calleeObjectIsAurelia = callee => {
			if (callee.type !== types.MemberExpression) {
				logDebug('Ignoring callee', callee);

				return false;
			}

			if (!aureliaParameter) {
				logDebug(
					'Ignoring calleeObjectIsAurelia check, aureliaParameter is not set',
					callee
				);

				return false;
			}

			if (aureliaParameter.name !== callee.object.name) {
				logDebug('aurelia parameter=', aureliaParameter);

				logDebug(
					'Ignoring callee as does not use aurelia',
					aureliaParameter,
					callee
				);

				return false;
			}
			return true;
		};

		const calleeObjectIsAureliaUse = callee => {
			// Check for calls like aurelia.use.<anyMethod>();
			if (callee.type !== types.MemberExpression) {
				logDebug(
					'calleeObjectIsAureliaUse():',
					'Ignoring callee as wrong type',
					callee
				);

				return false;
			}

			const object = callee.object; // MemberExpression of call
			const objectProperty = object.property;

			if (!objectProperty) {
				logDebug(
					'calleeObjectIsAureliaUse():',
					'Ignoring callee as object has no property',
					callee
				);

				return false;
			}

			if (
				objectProperty.type !== types.Identifier ||
				objectProperty.name !== 'use'
			) {
				logDebug(
					'calleeObjectIsAureliaUse():',
					'Ignoring property as not .use',
					objectProperty
				);

				return false;
			}

			if (!calleeObjectIsAurelia(object)) {
				return false;
			}

			return true;
		};

		const nodeIsCallToPlatformModuleName = node =>
			node.type === types.CallExpression &&
			node.callee.object.name === 'PLATFORM' &&
			node.callee.property.name === 'moduleName';

		const reportMustWrapModules = call => node =>
			context.report(
				node,
				`${call} must wrap modules with 'PLATFORM.moduleName()'`
			);

		const checkGlobalResources = callExpression => {
			// https://aurelia.io/docs/api/framework/class/FrameworkConfiguration/method/globalResources
			const callExpressionArguments = callExpression.arguments;

			const arg = callExpressionArguments[0];
			let globalResources = [arg]; // unify to array: use.globalResource(resource) => use.globalResource([resource])
			if (arg.type === types.ArrayExpression) {
				globalResources = arg.elements;
			}

			globalResources
				.filter(
					globalResource => !nodeIsCallToPlatformModuleName(globalResource)
				)
				.map(reportMustWrapModules('use.globalResources'));
		};

		const usesPlatformModuleName = node => {
			const callee = node.callee;

			if (
				callee.property.name === 'globalResources' &&
				node.arguments.length === 1 &&
				calleeObjectIsAureliaUse(callee)
			) {
				checkGlobalResources(node);
				return;
			}

			if (
				callee.property.name === 'setRoot' &&
				node.arguments.length === 1 &&
				calleeObjectIsAurelia(callee)
			) {
				const arg = node.arguments[0];
				if (!nodeIsCallToPlatformModuleName(arg)) {
					reportMustWrapModules('setRoot')(arg);
				}
			}

			return;
		};

		return {
			ExportNamedDeclaration: captureAureliaConfigure,
			CallExpression: usesPlatformModuleName,
		};
	},
};
