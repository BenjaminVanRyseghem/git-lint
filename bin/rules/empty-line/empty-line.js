module.exports = function(context) {
	"use strict";

	return function(message) {
		let lines = message.split("\n");

		if (lines.length < 2) {
			return;
		}

		let secondLine = lines[1];

		if (secondLine.length > 0) {
			context.report({
				message: "Second line should be empty.",
				loc: {
					line: 2,
					column: 1
				}
			});
		}
	};
};

module.exports.schema = [];