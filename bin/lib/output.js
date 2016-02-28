"use strict";

const mustache = require("mustache");
// let reporter = unixReporter;

function reportError(spec) {
	let level = spec.level;
	let file = spec.file;
	let rule = spec.rule;
	let errorOptions = spec.errorOptions;
	let contextOptions = spec.options;

	let message = errorOptions.message;

	console.error(`${file}:${errorOptions.loc.line}:${errorOptions.loc.column}: ${message} [Error/${rule}]`);
}

function reportWarning(spec) {
	let level = spec.level;
	let file = spec.file;
	let rule = spec.rule;
	let errorOptions = spec.errorOptions;
	let contextOptions = spec.options;

	let message = errorOptions.message;

	console.warn(`${file}:${errorOptions.loc.line}:${errorOptions.loc.column}: ${message} [Warning/${rule}]`);
}

function report(spec) {
	switch (spec.level) {
		case 2:
			reportError(spec);
			break;
		case 1:
			reportWarning(spec);
			return;
		default:
			throw new Error(`Rule level should be among 0, 1, 2. ${spec.level} was found`);
	}
}

function error(message, options) {
	console.error(mustache.render(message, options));
}

module.exports = {
	error: error,
	report: report
};