const pluginsConflict = "The plugin rule \"{{{rule}}}\" is already defined";
const stringFormatter = require("../../lib/util/stringFormatter");

module.exports = function(options) {

	if (!options.plugins || !options.plugins.length) {
		return {};
	}

	let result = {
		config: {},
		rules: {}
	};

	for (let name of options.plugins) {
		// Plugin name should match a npm package name
		let rules = {};
		try {
			rules = require(name);
		} catch (error) {
			console.error(stringFormatter(error.message)); // eslint-disable-line no-console
			return process.exit(1);
		}

		if (rules.config) {
			for (let name of Object.keys(rules.config)) {
				let opt = rules.config[name];
				if (result.config[name]) {
					console.error(stringFormatter(pluginsConflict, { // eslint-disable-line no-console
						rule: name
					}));
				} else {
					result.config[name] = opt;
				}
			}
		}

		if (rules.rules) {
			for (let name of Object.keys(rules.rules)) {
				let opt = rules.rules[name];
				if (result.rules[name]) {
					console.error(stringFormatter(pluginsConflict, { // eslint-disable-line no-console
						rule: name
					}));
				} else {
					result.rules[name] = opt;
				}
			}
		}
	}

	return result;
};
