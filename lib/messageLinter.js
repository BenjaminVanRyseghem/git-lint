const context = require("./context");
const isArray = require("./util/isArray");

module.exports = function({message, ruleName, ruleFunction, ruleOptions, lintResult, extraContext}) {
	let severity;

	if (isArray(ruleOptions)) {
		ruleOptions = ruleOptions.slice();
		severity = ruleOptions.shift();
	} else {
		severity = ruleOptions;
		ruleOptions = null;
	}

	if (severity === 0) {
		return;
	}

	let data = Object.assign({
		level: severity,
		options: ruleOptions,
		lintResult: lintResult,
		rule: ruleName
	}, extraContext);

	let newContext = context(data);

	// Apply the rule
	let allLines = message.split("\n");

	let lines = allLines.filter((line) => {
		return line[0] !== "#";
	});

	let comments = allLines.filter((line) => {
		return line[0] === "#";
	});

	ruleFunction(newContext)(message, lines, comments);
};
