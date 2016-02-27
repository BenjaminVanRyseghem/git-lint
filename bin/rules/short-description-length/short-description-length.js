module.exports = function(context) {
	"use strict";
	const defaultOptions = {
		length: 56
	};
	let options = defaultOptions;

	if (context.options && context.options.length) {
		if (context.options[0].length) {
			options.length = context.options[0].length;
		}
	}

	return function(message) {
		let lines = message.split("\n");
		let firstLine = lines[0];

		if (firstLine.length > options.length) {
			context.report({
				message: "Short description is too long.",
				loc: {
					line: 1,
					column: options.length
				}
			});
		}
	};
};

module.exports.schema = [
	{
		"type": "object",
		"properties": {
			"length": {
				"type": "integer"
			}
		},
		"additionalProperties": false
	}
];