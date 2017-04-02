const rule = require("../../../../lib/rules/long-description-length/long-description-length");

describe("context", () => {
	it("reports when the second line is longer that 72 characters", () => {
		let context = jasmine.createSpyObj("context", ["report"]);
		let message = jasmine.createSpy("message");
		let secondLine = "foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo";

		rule(context)(message, ["", secondLine]);

		expect(context.report).toHaveBeenCalled();
	});

	it("doesn't report when the second line is lesser that 72 characters", () => {
		let context = jasmine.createSpyObj("context", ["report"]);
		let message = jasmine.createSpy("message");
		let secondLine = "foooo";

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

	it("use length argument when provided", () => {
		let context = jasmine.createSpyObj("context", ["report"]);
		context.options = ["4"];
		let message = jasmine.createSpy("message");
		let secondLine = "foooo";

		rule(context)(message, ["", secondLine]);

		expect(context.report).toHaveBeenCalled();
	});
});
