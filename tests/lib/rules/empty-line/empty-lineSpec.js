const rule = require("../../../../lib/rules/empty-line/empty-line");

describe("context", () => {
	it("reports when the second line is not empty", () => {
		let context = jasmine.createSpyObj("context", ["report"]);
		let message = jasmine.createSpy("message");
		let secondLine = "foo";

		rule(context)(message, ["", secondLine]);

		expect(context.report).toHaveBeenCalled();
	});

	it("doesn't report when the second line is empty", () => {
		let context = jasmine.createSpyObj("context", ["report"]);
		let message = jasmine.createSpy("message");
		let secondLine = "";

		rule(context)(message, ["", secondLine]);

		expect(context.report).not.toHaveBeenCalled();
	});

	it("doesn't report when there is only one line", () => {
		let context = jasmine.createSpyObj("context", ["report"]);
		let message = jasmine.createSpy("message");
		let firstLine = "foooo";

		rule(context)(message, [firstLine]);

		expect(context.report).not.toHaveBeenCalled();
	});
});
