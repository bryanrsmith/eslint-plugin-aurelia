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
		let aureliaParameter;

		const captureAureliaConfigure = exportNamedDeclaration => {
			const functionDeclaration = exportNamedDeclaration.declaration;
			if (functionDeclaration.type !== types.FunctionDeclaration) {
				// TODO: Remove Console
				// eslint-disable-next-line no-console
				console.log('Ignoring exportNamedDeclaration', exportNamedDeclaration);

				return;
			}

			if (
				!functionDeclaration.id ||
				functionDeclaration.id.name !== 'configure'
			) {
				// TODO: Remove Console
				// eslint-disable-next-line no-console
				console.log('Ignoring non "configure" function', functionDeclaration);

				return;
			}

			const params = functionDeclaration.params;
			if (params.length !== 1) {
				// TODO: Remove Console
				// eslint-disable-next-line no-console
				console.log(
					'Ignoring "configure" function with incorrect params',
					functionDeclaration
				);

				return;
			}

			aureliaParameter = params[0];
		};

		const calleeObjectIsAurelia = callee => {
			if (callee.type !== types.MemberExpression) {
				// TODO: Remove Console
				// eslint-disable-next-line no-console
				console.log('Ignoring callee', callee);

				return false;
			}

			if (!aureliaParameter) {
				// TODO: Remove Console
				// eslint-disable-next-line no-console
				console.log(
					'Ignoring calleeObjectIsAurelia check, aureliaParameter is not set',
					callee
				);

				return false;
			}

			if (aureliaParameter.name !== callee.object.name) {
				// TODO: Remove Console
				// eslint-disable-next-line no-console
				console.log('Ignoring callee as does not use aurelia', callee);

				return false;
			}

			return true;
		};

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
