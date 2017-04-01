const schemaValidator = require("../../lib/schemaValidator");

describe("schemaValidator", () => {
	it("records schema error when mismatch between parameter numbers and number of options provided", () => {
		let ruleName = jasmine.createSpy();
		let schema = [
			{"type": "integer"}
		];
		let ruleOptions = [2];
		let lintResult = jasmine.createSpyObj("lintResult", ["schemaError"]);

		schemaValidator({
			ruleName,
			schema,
			ruleOptions,
			lintResult
		});

		expect(lintResult.schemaError).toHaveBeenCalledWith(ruleName, jasmine.any(String));
	});

	it("works when exact number of parameters are provided", () => {
		let ruleName = jasmine.createSpy();
		let schema = [
			{"type": "integer"}
		];
		let ruleOptions = [45, 2];
		let lintResult = jasmine.createSpyObj("lintResult", ["schemaError"]);

		schemaValidator({
			ruleName,
			schema,
			ruleOptions,
			lintResult
		});

		expect(lintResult.schemaError).not.toHaveBeenCalled();
	});

	it("regression test: fix the slice to remove the severity, not just take the first parameter schema", () => {
		let ruleName = jasmine.createSpy();
		let schema = [
			{"type": "integer"},
			{"type": "string"}
		];
		let ruleOptions = [45, "foo", 2];
		let lintResult = jasmine.createSpyObj("lintResult", ["schemaError"]);

		schemaValidator({
			ruleName,
			schema,
			ruleOptions,
			lintResult
		});

		expect(lintResult.schemaError).not.toHaveBeenCalled();
	});

	it("records an error when schema not valid", () => {
		let ruleName = "records an error when schema not valid";
		let parameterSchema = {"type": "integer"};
		let option = "foo";
		let lintResult = jasmine.createSpyObj("lintResult", ["schemaError"]);

		schemaValidator._validateParameterSchema({
			ruleName,
			parameterSchema,
			option,
			lintResult
		});

		expect(lintResult.schemaError).toHaveBeenCalled();
	});
});
