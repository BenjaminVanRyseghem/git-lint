"use strict";

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
	if (spec.level === 2) {
		reportError(spec);
		return;
	}

	if (spec.level === 1) {
		reportWarning(spec);
		return;
	}
}

function error(message, options) {
	console.error(message);
}

module.exports = {
	error: error,
	report: report
};