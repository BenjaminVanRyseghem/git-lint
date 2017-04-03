const rewire = require("rewire");
const output = rewire("../../../bin/lib/output");

describe("output", () => {
	let revert;
	let consoleSpy;

	beforeEach(() => {
		consoleSpy = jasmine.createSpyObj("console", ["error", "warn", "log"]);
		revert = output.__set__({
			"console": consoleSpy
		});
	});

	afterEach(() => {
		revert();
	});

	it("reports schema error", () => {
		let lintResult = jasmine.createSpyObj("lintResult", ["getData", "getSchemaErrors"]);
		lintResult.getSchemaErrors.and.returnValue([]);
		lintResult.getData.and.returnValue([]);

		output(lintResult);

		expect(lintResult.getSchemaErrors).toHaveBeenCalled();
	});

	it("output error for each schema error", () => {
		let schemaErrors = new Map();
		schemaErrors.set("name", "message");

		let lintResult = jasmine.createSpyObj("lintResult", ["getData", "getSchemaErrors"]);
		lintResult.getSchemaErrors.and.returnValue(schemaErrors);
		lintResult.getData.and.returnValue([]);

		output(lintResult);

		expect(consoleSpy.error).toHaveBeenCalled();
	});

	it("output error for data with error", () => {
		let dataError = {level: 2, errorOptions: {loc: {}}};

		let lintResult = jasmine.createSpyObj("lintResult", ["getData", "getSchemaErrors"]);
		lintResult.getSchemaErrors.and.returnValue([]);
		lintResult.getData.and.returnValue([dataError]);

		output(lintResult);

		expect(consoleSpy.error).toHaveBeenCalled();
	});

	it("output warning for data with warning", () => {
		let dataError = {level: 1, errorOptions: {loc: {}}};

		let lintResult = jasmine.createSpyObj("lintResult", ["getData", "getSchemaErrors"]);
		lintResult.getSchemaErrors.and.returnValue([]);
		lintResult.getData.and.returnValue([dataError]);

		output(lintResult);

		expect(consoleSpy.warn).toHaveBeenCalled();
	});

	it("ignores level 0 data", () => {
		let dataError = {level: 0};

		let lintResult = jasmine.createSpyObj("lintResult", ["getData", "getSchemaErrors"]);
		lintResult.getSchemaErrors.and.returnValue([]);
		lintResult.getData.and.returnValue([dataError]);

		output(lintResult);

		expect(consoleSpy.error).not.toHaveBeenCalled();
		expect(consoleSpy.warn).not.toHaveBeenCalled();
		expect(consoleSpy.log).not.toHaveBeenCalled();
	});

	it("throws an error when level is invalid", () => {
		let dataError = {level: 3};

		let lintResult = jasmine.createSpyObj("lintResult", ["getData", "getSchemaErrors"]);
		lintResult.getSchemaErrors.and.returnValue([]);
		lintResult.getData.and.returnValue([dataError]);

		let fn = output.bind(null, lintResult);

		expect(fn).toThrowError();
	});
});
