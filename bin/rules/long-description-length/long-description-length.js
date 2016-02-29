module.exports = function(context) {
	"use strict";
	const defaultOptions = {
		length: 72
	};
	let options = defaultOptions;

	if (context.options && context.options.length && context.options[0]) {
		options.length = context.options[0];
	}

	return function(message) {
		let lines = message.split("\n");
		lines.shift(); // Drop first line

		let lineNumber = 1;
		for (let line of lines) {
			lineNumber++;
			if (line.length > options.length) {
				context.report({
					message: "Long description is too long.",
					loc: {
						line: lineNumber,
						column: options.length
					}
				});
			}
		}
	};
};

module.exports.schema = [
	{
		"type": "integer"
	}
];