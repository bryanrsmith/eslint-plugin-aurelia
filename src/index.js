import injectRule from './rules/inject-matches-ctor';
import noConventionsRule from './rules/no-conventions';

export default {
	rules: {
		'inject-matches-ctor': injectRule,
		'no-conventions': noConventionsRule
	},
	rulesConfig: {
		'inject-matches-ctor': 2,
		'no-conventions': 0
	}
};
