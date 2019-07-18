import eslint from 'eslint';
import rule from '../../src/rules/webpack-entry-point';

const ruleTester = new eslint.RuleTester({ parser: 'babel-eslint' });

const moduleExportsEntryAppNotAurelia = `
  module.exports = function () {
    return {
      entry: {
        app: ['not-aurelia-bootstrapper']
      },
    }
  };
`;

const embedFilenameInCode = ({ filename, code }) => ({
	filename,
	code: `// filename=${filename}\n${code}`,
});

// Use https://astexplorer.net/ and `espree` tokens to transform your `code`
// into an AST for use here.
ruleTester.run('webpack-entry-point', rule, {
	valid: [
		{
			// Only webpack.config.js is checked for valid entry.app values
			...embedFilenameInCode({
				filename: '/some/dir/not.webpack.config.js',
				code: moduleExportsEntryAppNotAurelia,
			}),
		},
	],
	invalid: [
		{
			...embedFilenameInCode({
				filename: '/some/dir/webpack.config.js',
				code: moduleExportsEntryAppNotAurelia,
			}),
			errors: [
				{
					message:
						"entry.app must be ['aurelia-bootstrapper']: found ['not-aurelia-bootstrapper']",
					type: 'Identifier',
				},
			],
		},
	],
});
