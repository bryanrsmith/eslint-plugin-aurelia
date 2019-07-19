/*
  Ensure that module usage is wrapped in `PLATFORM.moduleName()`.
*/

const { types } = require('./eslint-types');

const identity = x => x;

const nameOfNode = node => {
	if (node.type === types.MethodDefinition) {
		return node.key.name;
	}

	return undefined;
};

const lookupInParentHierarchy = (node, type, name) => {
	let current = node.parent;
	while (current.type !== types.Program) {
		if (current.type === type && nameOfNode(current) === name) {
			return current;
		}
		current = current.parent;
	}

	return undefined;
};

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
				console.log('DEBUG:', ...args);
			}
		};

		const captureAureliaConfigure = exportNamedDeclaration => {
			const functionDeclaration = exportNamedDeclaration.declaration;
			if (functionDeclaration.type !== types.FunctionDeclaration) {
				return;
			}

			if (
				!functionDeclaration.id ||
				functionDeclaration.id.name !== 'configure'
			) {
				return;
			}

			const params = functionDeclaration.params;
			if (params.length !== 1) {
				logDebug(
					'captureAureliaConfigure():',
					'Ignoring "configure" function with incorrect params',
					functionDeclaration
				);

				return;
			}

			aureliaParameter = params[0];
		};

		const calleeObjectIsAurelia = callee => {
			if (callee.type !== types.MemberExpression) {
				logDebug('calleeObjectIsAurelia():', 'Ignoring callee', callee);

				return false;
			}

			if (!aureliaParameter) {
				logDebug(
					'calleeObjectIsAurelia():',
					'Ignoring calleeObjectIsAurelia check, aureliaParameter is not set',
					callee
				);

				return false;
			}

			if (aureliaParameter.name !== callee.object.name) {
				logDebug(
					'calleeObjectIsAurelia():',
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
			node &&
			node.type === types.CallExpression &&
			node.callee.object.name === 'PLATFORM' &&
			node.callee.property.name === 'moduleName';

		const reportMustWrapModules = call => node =>
			context.report(
				node,
				`${call} must wrap modules with 'PLATFORM.moduleName()'`
			);

		const transformRouteToModuleIdNode = routeNode => {
			if (routeNode.type !== types.ObjectExpression) {
				return undefined;
			}
			const moduleIdProperty = routeNode.properties.filter(
				property => property.key.name === 'moduleId'
			)[0];
			if (!moduleIdProperty) {
				return undefined;
			}
			return moduleIdProperty.value;
		};

		const checkArgumentsWrappedInPlatformModuleName = (
			callExpression,
			{ transformation = identity, callName = undefined }
		) => {
			const arg1 = callExpression.arguments[0];
			// Treat: single arg call and array arg call the same
			const args = arg1.type === types.ArrayExpression ? arg1.elements : [arg1];

			args
				.map(transformation)
				.filter(arg => arg && !nodeIsCallToPlatformModuleName(arg))
				.map(
					reportMustWrapModules(callName || callExpression.callee.property.name)
				);
		};

		const checkRouterConfig = node => {
			// https://aurelia.io/docs/api/router/interface/ConfiguresRouter/method/configureRouter
			const callee = node.callee;
			const calleeObject = callee.object;

			if (!calleeObject) {
				logDebug(
					'checkRouterConfig():',
					'Ignoring missing callee.object',
					callee
				);
				return;
			}

			const containedWithinMethodDefinition = lookupInParentHierarchy(
				node,
				types.MethodDefinition,
				'configureRouter'
			);
			if (!containedWithinMethodDefinition) {
				logDebug(
					'checkRouterConfig():',
					'Ignoring as not contained within MethodDefinition',
					node
				);
				return;
			}

			const methodValue = containedWithinMethodDefinition.value;
			if (methodValue.type !== types.FunctionExpression) {
				logDebug(
					'checkRouterConfig():',
					'Ignoring as contained within MethodDefinition does not have FunctionExpression as value',
					containedWithinMethodDefinition
				);
				return;
			}

			const params = methodValue.params;
			if (!params && params.length !== 2) {
				logDebug(
					'checkRouterConfig():',
					'Ignoring as MethodDefinition as FunctionExpression does not have correct signature',
					containedWithinMethodDefinition
				);
				return;
			}

			if (calleeObject.name !== params[0].name) {
				logDebug(
					'checkRouterConfig():',
					'Ignoring as call of .map as not on Router',
					containedWithinMethodDefinition
				);
				return;
			}

			// https://aurelia.io/docs/api/router/class/RouterConfiguration/method/map
			// https://aurelia.io/docs/api/router/interface/RouteConfig
			// Either a single RouteConfig or an array of them.
			checkArgumentsWrappedInPlatformModuleName(node, {
				transformation: transformRouteToModuleIdNode,
			});
		};

		const usesPlatformModuleName = node => {
			const callee = node.callee;

			if (
				callee.property.name === 'globalResources' &&
				node.arguments.length === 1 &&
				calleeObjectIsAureliaUse(callee)
			) {
				checkArgumentsWrappedInPlatformModuleName(node, {
					callName: 'use.globalResources',
				});
				return;
			}

			if (
				callee.property.name === 'setRoot' &&
				node.arguments.length === 1 &&
				calleeObjectIsAurelia(callee)
			) {
				checkArgumentsWrappedInPlatformModuleName(node, {
					callName: 'setRoot',
				});

				return;
			}

			if (
				callee.property.name === 'feature' &&
				node.arguments.length === 1 &&
				calleeObjectIsAureliaUse(callee)
			) {
				checkArgumentsWrappedInPlatformModuleName(node, {
					callName: 'use.feature',
				});
				return;
			}

			if (
				callee.property.name === 'plugin' &&
				node.arguments.length === 1 &&
				calleeObjectIsAureliaUse(callee)
			) {
				checkArgumentsWrappedInPlatformModuleName(node, {
					callName: 'use.plugin',
				});
				return;
			}

			if (callee.property.name === 'map' && node.arguments.length === 1) {
				checkRouterConfig(node);
				return;
			}

			return;
		};

		return {
			ExportNamedDeclaration: captureAureliaConfigure,
			CallExpression: usesPlatformModuleName,
		};
	},
};
