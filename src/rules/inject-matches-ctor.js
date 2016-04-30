import { getInjectInfo } from '../inject-helper';

export default function injectMatchesCtorRule(context) {
	return {
		'ClassDeclaration'(node) {
			const injectInfo = getInjectInfo(node, context.getSourceCode());

			if (!injectInfo.injects.length) {
				return;
			}

			const [ injectElement, ...rest ] = injectInfo.injects;
			for (const duplicateInject of rest) {
				context.report(duplicateInject.node, 'Unexpected duplicate inject.');
			}

			const ctorParamsLength = injectInfo.ctor.params.length;
			if (injectElement.deps.length !== ctorParamsLength) {
				context.report(injectElement.node, 'Constructor parameters do not match injected dependencies.');
			}
		},
	};
}

injectMatchesCtorRule.schema = [];
