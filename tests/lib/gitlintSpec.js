require("../helpers/spyOnModule");
const gitlint = require("../../lib/gitlint");

describe("gitlint", () => {

	it("throws an Error when no rule provided", function() {
		let message = "";

		let fn = gitlint.bind(null, message);

		expect(fn).toThrowError();
	});

	it("throws an Error when not finding a rule", function() {
		let message = "";
		let options = {
			rules: {
				"fooboo": 2
			}
		};

		let fn = gitlint.bind(null, message, options);

		expect(fn).toThrowError();
	});

	it("gets the rule out extraRuleFunctions", function() {
		let message = "";
		let extraFunction = jasmine.createSpy("extraFunction");
		let options = {
			extraRules: {
				"fooboo": extraFunction
			},
			rules: {
				"fooboo": 2
			}
		};

		let lint = global.spyOnModule("../../lib/messageLinter");

		gitlint(message, options);

		expect(lint.calls.argsFor(0)[0].ruleFunction).toBe(extraFunction);
	});

	it("validates rule options over the rule schema", () => {
		let message = "";
		let options = {
			rules: {
				"short-description-length": ["extra-arg", 2]
			}
		};

		let schemaValidator = global.spyOnModule("../../lib/schemaValidator");

		gitlint(message, options);

		expect(schemaValidator).toHaveBeenCalled();
	});

	it("doesn't validate rule options over the rule schema if no options provided", () => {
		let message = "";
		let options = {
			rules: {
				"short-description-length": 2
			}
		};

		let schemaValidator = global.spyOnModule("../../lib/schemaValidator");

		gitlint(message, options);

		expect(schemaValidator).not.toHaveBeenCalled();
	});

	it("calls `lint` for each rule", () => {
		let message = "Short enough description";
		let options = {
			rules: {
				"short-description-length": 2
			}
		};
		let numberOfRules = Object.keys(options.rules).length;
		let lint = global.spyOnModule("../../lib/messageLinter");

		gitlint(message, options);

		expect(lint).toHaveBeenCalledTimes(numberOfRules);
	});

	describe("rules", () => {
		describe("default rules", () => {
			describe("short-description-length", () => {
				it("goes well for short short-description", () => {
					let message = "Short enough description";
					let options = {
						rules: {
							"short-description-length": 2
						}
					};

					let result = gitlint(message, options);
					let errored = result.isErrored();

					expect(errored).toBeFalsy();
				});
			});
		});
	});
});
