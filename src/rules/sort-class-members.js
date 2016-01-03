import { sortClassMembers } from 'eslint-plugin-sort-class-members/dist/rules/sort-class-members';

let groups = {
	'lifecycle': [
		{ type: 'method', name: 'configureRouter' },
		{ type: 'method', name: 'determineActivationStrategy' },
		{ type: 'method', name: 'created' },
		{ type: 'method', name: 'canActivate' },
		{ type: 'method', name: 'activate' },
		{ type: 'method', name: 'bind' },
		{ type: 'method', name: 'attached' },
		{ type: 'method', name: 'canDeactivate' },
		{ type: 'method', name: 'deactivate' },
		{ type: 'method', name: 'detached' },
		{ type: 'method', name: 'unbind' },
	],
	'component-lifecycle': [
		{ type: 'method', name: 'created' },
		{ type: 'method', name: 'bind' },
		{ type: 'method', name: 'attached' },
		{ type: 'method', name: 'detached' },
		{ type: 'method', name: 'unbind' },
	],
	'router-lifecycle': [
		{ type: 'method', name: 'configureRouter' },
		{ type: 'method', name: 'determineActivationStrategy' },
		{ type: 'method', name: 'canActivate' },
		{ type: 'method', name: 'activate' },
		{ type: 'method', name: 'canDeactivate' },
		{ type: 'method', name: 'deactivate' },
	],
};

export default sortClassMembers.getRule({ groups });

export const defaultOrder = [
	{ name: 'metadata', type: 'method', static: true },
	'[static-properties]',
	'[static-methods]',
	'[properties]',
	{ name: 'inject', static: true },
	'constructor',
	'[everything-else]',
	'[lifecycle]',
];
