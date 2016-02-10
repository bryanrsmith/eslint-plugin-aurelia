import injectRule from './rules/inject-matches-ctor';
import noConventionsRule from './rules/no-conventions';
import noConsoleLogRule from './rules/no-console-log';
import storeUnsubscribeRule from './rules/store-unsubscribe';
import sortClassMembers, { defaultOrder } from './rules/sort-class-members';

module.exports = {
	rules: {
		'inject-matches-ctor': injectRule,
		'no-conventions': noConventionsRule,
		'no-console-log': noConsoleLogRule,
		'store-unsubscribe': storeUnsubscribeRule,
		'sort-class-members': sortClassMembers,
	},
	rulesConfig: {
		'inject-matches-ctor': 2,
		'no-conventions': 0,
		'no-console-log': 0,
		'store-unsubscribe': 0,
		'sort-class-members': [0, {
			order: defaultOrder,
		}],
	},
};
