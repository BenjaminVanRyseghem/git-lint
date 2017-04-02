require("../helpers/spyOnModule");
const context = require("../../lib/context");

describe("context", () => {
	it("report delegates to lintResult", () => {
		let level = jasmine.createSpy("level");
		let options = jasmine.createSpy("options");
		let file = jasmine.createSpy("file");
		let rule = jasmine.createSpy("rule");
		let errorOptions = jasmine.createSpy("errorOptions");

		let lintResult = jasmine.createSpyObj("lintResult", ["report"]);

		let instance = context({options, lintResult, file, rule, level});
		instance.report(errorOptions);

		expect(lintResult.report).toHaveBeenCalledWith({
			context: instance,
			level,
			errorOptions,
			file,
			rule,
			contextOptions: options
		});
	});

	it("is errored when level is `2`", () => {
		let options = jasmine.createSpy("options");
		let file = jasmine.createSpy("file");
		let rule = jasmine.createSpy("rule");
		let errorOptions = jasmine.createSpy("errorOptions");

		let lintResult = jasmine.createSpyObj("lintResult", ["report"]);
		let level = 2;
		
		let instance = context({options, lintResult, file, rule, level});

		instance.report(errorOptions);

		expect(instance.hasErrors()).toBeTruthy();
	});
});
