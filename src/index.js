import injectRule from './rules/inject-matches-ctor';
import noConventionsRule from './rules/no-conventions';
import noConsoleLogRule from './rules/no-console-log';
import sortClassMembers, { defaultOrder } from './rules/sort-class-members';

export default {
	rules: {
		'inject-matches-ctor': injectRule,
		'no-conventions': noConventionsRule,
		'no-console-log': noConsoleLogRule,
		'sort-class-members': sortClassMembers,
	},
	rulesConfig: {
		'inject-matches-ctor': 2,
		'no-conventions': 0,
		'no-console-log': 0,
		'sort-class-members': [0, {
			order: defaultOrder,
		}]
	}
};
