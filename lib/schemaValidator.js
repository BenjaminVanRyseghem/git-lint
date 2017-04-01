const validator = require("is-my-json-valid");

const stringFormatter = require("./util/stringFormatter");

const schemaLengthMismatch = "{{{rule}}}: the schema allow {{{schema}}} options but {{{options}}} were provided.";
const failValidation = "Fail to validate the options against the schema of \"{{{rule}}}\":";
const failError = "\t- \"{{{field}}}\" {{{message}}};";

function writeErrors({ruleName, errors}) {
	let result = "";

	result += stringFormatter(failValidation, {
		rule: ruleName
	});

	for (let error of errors) {
		result += stringFormatter(failError, error);
	}

	return result;
}

function validateParameterSchema({ruleName, parameterSchema, option, lintResult}) {
	let validate = validator(parameterSchema, {
		greedy: true
	});

	let valid = validate(option);

	if (!valid) {
		lintResult.schemaError(ruleName, writeErrors({
			ruleName,
			errors: validate.errors
		}));
	}

	return valid;
}

module.exports = function({ruleName, schema, ruleOptions, lintResult}) {
	ruleOptions = ruleOptions.slice(0, -1);

	if (ruleOptions.length !== schema.length) {
		lintResult.schemaError(ruleName, stringFormatter(schemaLengthMismatch, {
			rule: ruleName,
			schema: schema.length,
			options: ruleOptions.length
		}));

		return false;
	}

	return schema.every((parameterSchema, index) => {
		return validateParameterSchema({
			ruleName,
			parameterSchema,
			option: ruleOptions[index],
			lintResult
		});
	});
};

module.exports._validateParameterSchema = validateParameterSchema;
