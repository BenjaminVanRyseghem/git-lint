"use strict";

const output = require("./output");
const validator = require('is-my-json-valid');

const schemaLengthMismatch = "The schema allow {{{schema}}} options but {{{options}}} were provided.";
const failValidation = "Fail to validate the options against the schema of \"{{{rule}}}\":";
const failError = "\t- \"{{{field}}}\" {{{message}}};";

function outputValidateErrors(rule, errors) {
	output.error(failValidation, {
		rule: rule
	});

	for (let error of errors) {
		output.error(failError, error);
	}
}

function validateSchema(rule, schema, option) {
	let validate = validator(schema, {
		greedy: true
	});

	let valid = validate(option);

	if (!valid) {
		outputValidateErrors(rule, validate.errors);
	}

	return valid;
}

function schemaValidator(rule, schemas, options) {

	let ruleOptions = options.slice(1);

	if (ruleOptions.length !== schemas.length) {
		output.error(schemaLengthMismatch, {
			schema: schemas.length,
			options: ruleOptions.length
		});

		return false;
	}

	return schemas.every((schema, index) => {
		return validateSchema(rule, schema, ruleOptions[index]);
	});
}

module.exports = schemaValidator;