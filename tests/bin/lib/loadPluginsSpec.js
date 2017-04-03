const rewire = require("rewire");
const loadPlugins = rewire("../../../bin/lib/loadPlugins");

describe("loadPlugins", () => {

	let revert;
	let requireSpy;
	let consoleSpy;
	let processSpy;

	beforeEach(() => {
		requireSpy = jasmine.createSpy("require");
		consoleSpy = jasmine.createSpyObj("console", ["error"]);
		processSpy = jasmine.createSpyObj("process", ["exit"]);
		revert = loadPlugins.__set__({
			"require": requireSpy,
			"process": processSpy,
			"console": consoleSpy
		});
	});

	afterEach(() => {
		revert();
	});

	it("returns an empty object if no `plugins` field", function() {
		let options = {};

		let result = loadPlugins(options);
		expect(result).toEqual({});
	});

	it("returns an empty object if `plugins` field is empty", function() {
		let options = {
			plugins: []
		};

		let result = loadPlugins(options);
		expect(result).toEqual({});
	});

	it("tries to require every plugin pluginName", function() {
		let pluginName = jasmine.createSpy("pluginName");
		let options = {
			plugins: [pluginName]
		};
		requireSpy.and.returnValue({});

		loadPlugins(options);

		expect(requireSpy).toHaveBeenCalledTimes(1);
		expect(requireSpy).toHaveBeenCalledWith(pluginName);
	});

	it("exits the process when a plugin is not found", function() {
		let pluginName = jasmine.createSpy("pluginName");
		let options = {plugins: [pluginName]};

		requireSpy.and.throwError("Plugin not found");

		loadPlugins(options);

		expect(processSpy.exit).toHaveBeenCalledWith(1);
	});

	it("output an error when a plugin is not found", function() {
		let pluginName = jasmine.createSpy("pluginName");
		let options = {plugins: [pluginName]};

		requireSpy.and.throwError("Plugin not found");

		loadPlugins(options);

		expect(consoleSpy.error).toHaveBeenCalledTimes(1);
		expect(consoleSpy.error).toHaveBeenCalledWith(jasmine.any(String));
	});

	it("gathers configs from plugins", function() {
		let pluginName = jasmine.createSpy("pluginName");
		let options = {
			plugins: [pluginName]
		};

		let ruleName = "rule";
		let ruleOptions = jasmine.createSpy("ruleOptions");
		let config = {};
		config[ruleName] = ruleOptions;
		requireSpy.and.returnValue({config});

		let result = loadPlugins(options);

		expect(result.config[ruleName]).toBe(ruleOptions);
	});

	it("output an error when config conflict", function() {
		let pluginName = jasmine.createSpy("pluginName");
		let options = {
			plugins: [pluginName, pluginName]
		};

		let ruleName = "rule";
		let ruleOptions = jasmine.createSpy("ruleOptions");
		let config = {};
		config[ruleName] = ruleOptions;
		requireSpy.and.returnValue({config});

		loadPlugins(options);

		expect(consoleSpy.error).toHaveBeenCalled();
	});

	it("gathers rules from plugins", function() {
		let pluginName = jasmine.createSpy("pluginName");
		let options = {
			plugins: [pluginName]
		};

		let ruleName = "rule";
		let ruleOptions = jasmine.createSpy("ruleOptions");
		let rules = {};
		rules[ruleName] = ruleOptions;
		requireSpy.and.returnValue({rules});

		let result = loadPlugins(options);

		expect(result.rules[ruleName]).toBe(ruleOptions);
	});

	it("output an error when rules conflict", function() {
		let pluginName = jasmine.createSpy("pluginName");
		let options = {
			plugins: [pluginName, pluginName]
		};

		let ruleName = "rule";
		let ruleOptions = jasmine.createSpy("ruleOptions");
		let rules = {};
		rules[ruleName] = ruleOptions;
		requireSpy.and.returnValue({rules});

		loadPlugins(options);

		expect(consoleSpy.error).toHaveBeenCalled();
	});
});
