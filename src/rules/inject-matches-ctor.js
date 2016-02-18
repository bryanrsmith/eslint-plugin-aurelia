import { getInjectInfo } from '../inject-helper';

export default function injectMatchesCtorRule(context) {
	return {
		'ClassDeclaration'(node) {
			let injectInfo = getInjectInfo(node, context.getSourceCode());

			if (!injectInfo.injects.length) {
				return;
			}

			let [ injectElement, ...rest ] = injectInfo.injects;
			for (let duplicateInject of rest) {
				context.report(duplicateInject.node, 'Unexpected duplicate inject.');
			}

			let ctorParamsLength = injectInfo.ctor.params.length;
			if (injectElement.deps.length !== ctorParamsLength) {
				context.report(injectElement.node, 'Constructor parameters do not match injected dependencies.');
			}
		},
	};
}
