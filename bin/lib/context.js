function context(spec) {
	"use strict";

	var that = {};
	that.options = spec.options;

	let output = spec.output;
	let level = spec.level;
	let file = spec.file;
	let rule = spec.rule;

	let hasErrors = false;

	that.report = (errorOptions) => {
		if (level === 2) {
			hasErrors = true;
		}

		output.report({
			level: level,
			errorOptions: errorOptions,
			contextOptions: that.options,
			file: file,
			rule: rule
		});
	};

	that.hasErrors = function() {
		return hasErrors;
	};

	return that;
}

module.exports = context;