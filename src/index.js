import injectRule from './rules/inject-matches-ctor';
import injectTypeRule from './rules/inject-type';
import noConventionsRule from './rules/no-conventions';
import noConsoleLogRule from './rules/no-console-log';
import storeUnsubscribeRule from './rules/store-unsubscribe';
import sortClassMembers, { defaultOrder } from './rules/sort-class-members';

module.exports = {
	rules: {
		'inject-matches-ctor': injectRule,
		'inject-type': injectTypeRule,
		'no-conventions': noConventionsRule,
		'no-console-log': noConsoleLogRule,
		'store-unsubscribe': storeUnsubscribeRule,
		'sort-class-members': sortClassMembers,
	},
	configs: {
		recommended: {
			rules: {
				'inject-matches-ctor': 2,
				'inject-type': 0,
				'no-conventions': 0,
				'no-console-log': 0,
				'store-unsubscribe': 2,
				'sort-class-members': [ 2, {
					order: defaultOrder,
				}],
			},
		},
	},
};
