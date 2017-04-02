const rule = require("../../../../lib/rules/short-description-length/short-description-length");

describe("context", () => {
	it("reports when the first line is longer that 50 characters", () => {
		let context = jasmine.createSpyObj("context", ["report"]);
		let message = jasmine.createSpy("message");
		let firstLine = "foooooooooooooooooooooooooooooooooooooooooooooooooo";

		rule(context)(message, [firstLine]);

		expect(context.report).toHaveBeenCalled();
	});

	it("doesn't report when the first line is lesser that 50 characters", () => {
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
		let firstLine = "foooo";

		rule(context)(message, [firstLine]);

		expect(context.report).toHaveBeenCalled();
	});
});
