module.exports = function(context) {
	const defaultOptions = {
		length: 50
	};
	let options = defaultOptions;

	if (context.options && context.options.length && context.options[0]) {
		options.length = context.options[0];
	}

	return function(message, lines) {
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
		"type": "integer"
	}
];
