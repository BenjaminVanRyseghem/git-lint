// Todo: implement reporters
function reportError(spec) {
	let file = spec.file;
	let rule = spec.rule;
	let errorOptions = spec.errorOptions;

	let message = errorOptions.message;

	console.error(`${file}:${errorOptions.loc.line}:${errorOptions.loc.column}: ${message} [Error/${rule}]`); // eslint-disable-line no-console
}

function reportWarning(spec) {
	let file = spec.file;
	let rule = spec.rule;
	let errorOptions = spec.errorOptions;

	let message = errorOptions.message;

	console.warn(`${file}:${errorOptions.loc.line}:${errorOptions.loc.column}: ${message} [Warning/${rule}]`); // eslint-disable-line no-console
}

function report({level}) {
	switch (level) {
		case 2:
			reportError(...arguments);
			break;
		case 1:
			reportWarning(...arguments);
			return;
		case 0:
			break;
		default:
			throw new Error(`Rule level should be among 0, 1, 2. ${level} was found`);
	}
}

function reportResult(lintResult) {
	lintResult.getData().forEach(report);
}

module.exports = reportResult;
