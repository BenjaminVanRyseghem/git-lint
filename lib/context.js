function context(spec) {
	let that = {};
	that.options = spec.options;
	that.git = spec.git;

	let lintResult = spec.lintResult;
	let level = spec.level;
	let file = spec.file;
	let rule = spec.rule;

	let hasErrors = false;

	that.report = (errorOptions) => {
		if (level === 2) {
			hasErrors = true;
		}

		lintResult.report({
			context: that,
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
