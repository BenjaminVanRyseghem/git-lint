require("../../helpers/spyOnModule");

const rewire = require("rewire");
const cli = rewire("../../../bin/lib/cli");

describe("cli", () => {
	let revert;
	let consoleSpy;
	let processSpy;

	beforeEach(() => {
		consoleSpy = jasmine.createSpyObj("console", ["error", "warn", "log"]);
		processSpy = jasmine.createSpyObj("process", ["exit"]);
		revert = cli.__set__({
			"console": consoleSpy,
			"process": processSpy
		});
	});

	afterEach(() => {
		revert();
	});

	it("calls appInfo to display version info", () => {
		let appInfo = global.spyOnModule("../../bin/lib/util/appInfo");
		appInfo.and.returnValue({});

		cli.displayVersion();

		expect(appInfo).toHaveBeenCalled();
	});

	it("calls appInfo to display help info", () => {
		let appInfo = global.spyOnModule("../../bin/lib/util/appInfo");
		appInfo.and.returnValue({});

		cli.displayHelp();

		expect(appInfo).toHaveBeenCalled();
	});

	it("output error when parsing an invalid arg", () => {
		processSpy.argv = ["file", "invalid_arg"];

		let instance = cli.__get__("cli");
		spyOn(instance, "parse").and.throwError();

		cli.getArguments();

		expect(consoleSpy.error).toHaveBeenCalled();
	});

	it("output help when parsing an invalid arg", () => {
		processSpy.argv = ["file", "invalid_arg"];

		let instance = cli.__get__("cli");
		spyOn(instance, "parse").and.throwError();

		cli.getArguments();

		expect(consoleSpy.log).toHaveBeenCalled();
	});

	it("exits when parsing an invalid arg", () => {
		processSpy.argv = ["file", "invalid_arg"];

		let instance = cli.__get__("cli");
		spyOn(instance, "parse").and.throwError();

		cli.getArguments();

		expect(processSpy.exit).toHaveBeenCalledWith(1);
	});

	it("displays help when the help flag is provided", () => {
		processSpy.argv = ["file", "invalid_arg"];

		let instance = cli.__get__("cli");
		spyOn(instance, "parse").and.returnValue({help: true});

		let displayHelpSpy = jasmine.createSpy("displayHelp");
		let revert = cli.__set__("displayHelp", displayHelpSpy);

		try {
			cli.getArguments();

			expect(displayHelpSpy).toHaveBeenCalled();
			expect(processSpy.exit).toHaveBeenCalledWith(0);
		} finally {
			revert();
		}
	});

	it("displays version when the version flag is provided", () => {
		processSpy.argv = ["file", "invalid_arg"];

		let instance = cli.__get__("cli");
		spyOn(instance, "parse").and.returnValue({version: true});

		let displayVersionSpy = jasmine.createSpy("displayVersion");
		let revert = cli.__set__("displayVersion", displayVersionSpy);

		try {
			cli.getArguments();

			expect(displayVersionSpy).toHaveBeenCalled();
			expect(processSpy.exit).toHaveBeenCalledWith(0);
		} finally {
			revert();
		}
	});

	it("returns options oup of cli", () => {
		processSpy.argv = ["file", "invalid_arg"];
		let options = jasmine.createSpy("options");

		let instance = cli.__get__("cli");
		spyOn(instance, "parse").and.returnValue(options);

		let result = cli.getArguments();

		expect(result).toBe(options);
	});
});
