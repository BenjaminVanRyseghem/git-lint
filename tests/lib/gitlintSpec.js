require("../helpers/spyOnModule");
const gitlint = require("../../lib/gitlint");

fdescribe("gitlint", () => {

	it("calls `lint` for each rule", () => {
		let message = "Short enough description";
		let options = {
			rules: {
				"short-description-length": 2
			}
		};
		let numberOfRules = Object.keys(options.rules).length;
		let lint = spyOnModule("../../lib/messageLinter");

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
				})
			})
		})
	});
});
