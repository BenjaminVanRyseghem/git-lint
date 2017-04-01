const noRulesErrorMessage = "No rules provided.";
const noRuleFoundErrorMessage = "The rule \"{{{rule}}}\" was not found.";

/**
 *
 * @param message - message to lint
 *
 * @param options
 * @param options.rules - Main configuration
 * @param   [options.pluginRules] - Rules loaded via npm plugins
 * @param     options.pluginRules.config - Map where keys are rule names and values are verbose level (0: disabled, 1: warning, 2: error)
 * @param     options.pluginRules.rules - Map where keys are rule names and values are functions
 * @param   [options.extraRules] - Rules loaded locally from a directory. Map where keys are rule names and values are functions
 *
 * @param extraContext - Extra info to pass to rule context
 *
 * @return {boolean}
 */
function validateMessage(message, options = {}, extraContext = {}) {
	const lint = require("./messageLinter");
	const isArray = require("./util/isArray");
	const schemaValidator = require("./schemaValidator");
	const lintResult = require("./lintResult");
	const defaultRules = require("./rules/rules");

	let pluginRules = options.pluginRules || {config: {}, rules: {}};
	let extraRuleFunctions = options.extraRules || {};

	let rules = Object.assign({}, pluginRules.config, options.rules);
	let rulesFunctions = Object.assign({}, pluginRules.rules, defaultRules);

	if (!rules) {
		throw new Error(noRulesErrorMessage);
	}

	let result = lintResult();

	for (let ruleName of Object.keys(rules).sort()) {
		let ruleFunction = rulesFunctions[ruleName];

		if (!ruleFunction) {
			ruleFunction = extraRuleFunctions[ruleName];
		}

		if (!ruleFunction) {
			throw new Error(noRuleFoundErrorMessage, {
				rule: ruleName
			});
		}

		let isSchemaValid = true;
		let ruleOptions = rules[ruleName];

		if (isArray(ruleOptions)) {
			isSchemaValid = schemaValidator({
				ruleName,
				schema: ruleFunction.schema,
				ruleOptions,
				lintResult: result
			});
		}

		if (isSchemaValid) {
			lint({
				message,
				ruleName,
				ruleFunction,
				ruleOptions,
				lintResult: result,
				extraContext
			});
		}
	}

	return result;
}

module.exports = validateMessage;
