function lintResult() {
	let that = {};

	let results = [];
	let schemaErrors = new Map();

	that.report = function(data) {
		results.push(data);
	};

	that.getData = function() {
		return results.slice();
	};

	that.schemaError = function(ruleName, message) {
		schemaErrors.set(ruleName, message);
	};

	that.isErrored = function() {
		return results.some((value) => {
			return value.context.hasErrors();
		});
	};

	return that;
}

module.exports = lintResult;
