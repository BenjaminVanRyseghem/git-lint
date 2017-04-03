const lintResut = require("../../lib/lintResult");

describe("lintResult", () => {
	let instance;

	beforeEach(() => {
		instance = lintResut();
	});

	it("gathers data", function() {
		let data = jasmine.createSpy("data");

		instance.report(data);

		expect(instance.getData()).toContain(data);
	});

	it("returns a copy of data", function() {
		let data = jasmine.createSpy("data");

		let result = instance.getData();
		result.push(data);

		expect(instance.getData()).not.toContain(data);
	});

	it("gathers schema errors", function() {
		let ruleName = jasmine.createSpy("ruleName");
		let message = jasmine.createSpy("message");

		instance.schemaError(ruleName, message);

		expect(instance.getSchemaErrors().get(ruleName)).toBe(message);
	});

	it("is errored if one data has errors", function() {
		let data = {context: {hasErrors: () => true}};

		instance.report(data);

		expect(instance.isErrored()).toBeTruthy();
	});

	it("is not errored if no data has errors", function() {
		let data = {context: {hasErrors: () => false}};

		instance.report(data);

		expect(instance.isErrored()).toBeFalsy();
	});
});
