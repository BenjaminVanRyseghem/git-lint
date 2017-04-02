require("../helpers/spyOnModule");
const messageLinter = require("../../lib/messageLinter");

describe("messageLinter", () => {
	it("doesn't call ruleFunction when severity is `0`", function() {
		let ruleFunction = jasmine.createSpy("ruleFunction");
		let severity = 0;

		messageLinter({
			ruleOptions: severity,
			ruleFunction
		});

		expect(ruleFunction).not.toHaveBeenCalled();
	});

	it("uses last option as severity", function() {
		let ruleFunction = jasmine.createSpy("ruleFunction");
		ruleFunction.and.returnValue(() => {});
		let severity = 2;

		let context = global.spyOnModule("../../lib/context");

		messageLinter({
			message: "",
			ruleOptions: ["", severity],
			ruleFunction
		});

		expect(context.calls.argsFor(0)[0].level).toBe(severity);
	});

	it("flattens `extraContext` in the data", function() {
		let ruleFunction = jasmine.createSpy("ruleFunction");
		ruleFunction.and.returnValue(() => {});
		let severity = 2;
		let extra = jasmine.createSpy("extra");
		let extraContext = {extra};

		let context = global.spyOnModule("../../lib/context");

		messageLinter({
			message: "",
			ruleOptions: ["", severity],
			ruleFunction,
			extraContext
		});

		expect(context.calls.argsFor(0)[0].extra).toBe(extra);
	});

	it("calls the rules with actual lines separated from comments", function() {
		let rule = jasmine.createSpy("rule");
		let ruleFunction = jasmine.createSpy("ruleFunction");
		ruleFunction.and.returnValue(rule);

		let severity = 2;
		let line1 = "foo";
		let line2 = "bar";
		let comment1 = "#baz";

		let message = [line1, line2, comment1].join("\n");

		messageLinter({
			ruleOptions: severity,
			ruleFunction,
			message
		});

		expect(rule).toHaveBeenCalledWith(message, [line1, line2], [comment1]);
	});
});
