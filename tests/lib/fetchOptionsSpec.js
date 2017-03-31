describe("fetchOptions", function() {
	"use strict";

	const fetchOptions = require("../../bin/lib/fetchOptions");
	const isWindows = process.platform === "win32" || process.platform === "win64";

	it("can read JSON options", () => {
		let fs = require("fs");
		let expectedOptions = {foo: 4};
		let path = "foo/bar";

		spyOn(fs, "readFileSync").and.returnValue(JSON.stringify(expectedOptions));
		expect(fetchOptions._readJsonOptions(path)).toEqual(expectedOptions);
		expect(fs.readFileSync).toHaveBeenCalledWith(path, "utf8");
	});

	it("can read js options", () => {
		let expectedOptions = {foo: 4};
		let path = "../../tests/fixtures/lib/fetchOptions/.gitlintrc"

		expect(fetchOptions._readJSOptions(path)).toEqual(expectedOptions);
	});

	it("js has priority for local options", () => {
		let fs = require("fs");
		let path = "tests/fixtures/lib/fetchOptions";
		let expectedOptions = {foo: 4};

		spyOn(fs, "existsSync").and.returnValues(true, true);

		expect(fetchOptions._findLocalOption(path)).toEqual(expectedOptions);
		expect(fs.existsSync.calls.count()).toEqual(1);
		expect(fs.existsSync).toHaveBeenCalledWith(jasmine.stringMatching('.gitlintrc.js'));
	});

	it("json is used for local options if no js", () => {
		let fs = require("fs");
		let path = "tests/fixtures/lib/fetchOptions";
		let expectedOptions = {foo: 4};

		spyOn(fs, "existsSync").and.returnValues(false, true);
		spyOn(fs, "readFileSync").and.returnValue(JSON.stringify(expectedOptions));

		expect(fetchOptions._findLocalOption(path)).toEqual(expectedOptions);
		expect(fs.existsSync.calls.count()).toEqual(2);
		expect(fs.existsSync).toHaveBeenCalledWith(jasmine.stringMatching('.gitlintrc.json'));
	});

	it("return null when no local file found", () => {
		let fs = require("fs");
		let path = "tests/fixtures/lib/fetchOptions";
		let expectedOptions = {foo: 4};

		spyOn(fs, "existsSync").and.returnValues(false, false);

		expect(fetchOptions._findLocalOption(path)).toBe(null);
		expect(fs.existsSync.calls.count()).toEqual(2);
	});

	it("parent directory works as expected(`cd ..`)", () => {
		let path = "/foo/bar";

		expect(fetchOptions._parentDirectory(path)).toBe("/foo");
	});

	it("merge options with the correct precedence order", () => {
		let bottom = {a: 4, b: 5};
		let top = {a: 7, c: 9};
		let expectedOptions = {a: 4, b: 5, c: 9};

		expect(fetchOptions._mergeOptions(bottom, top)).toEqual(expectedOptions);
	});

	it("merging is done deep", () => {
		let bottom = {a: {b: 5}};
		let top = {a: {c: 9}};
		let expectedOptions = {a: {b: 5, c: 9}};

		expect(fetchOptions._mergeOptions(bottom, top)).toEqual(expectedOptions);
	});

	it("merging is done deep with correct order", () => {
		let bottom = {a: {b: 5, c: 6}};
		let top = {a: {c: 9, d: 0}};
		let expectedOptions = {a: {b: 5, c: 6, d: 0}};

		expect(fetchOptions._mergeOptions(bottom, top)).toEqual(expectedOptions);
	});

	it("merge options doesn't mutate the arguments", () => {
		let bottom = {a: 4, b: 5};
		let top = {a: 7, c: 9};
		let expectedBottom = {a: 4, b: 5};
		let expectedTop = {a: 7, c: 9};

		fetchOptions._mergeOptions(bottom, top);

		expect(bottom).toEqual(expectedBottom);
		expect(top).toEqual(expectedTop);
	});

	it("can merge options when the firt argument is null", () => {
		let top = {a: 7, c: 9};

		expect(fetchOptions._mergeOptions(null, top)).toEqual(top);
	});

	it("can merge options when the second argument is null", () => {
		let bottom = {a: 4, b: 5};

		expect(fetchOptions._mergeOptions(bottom, null)).toEqual(bottom);
	});

	it("merge options is null when both arguments are null", () => {
		expect(fetchOptions._mergeOptions(null, null)).toEqual(null);
	});

	it("fetch options until the parent dir is null", () => {
		expect(fetchOptions(null)).toBe(null);
	});

	it("fetch options until the parent is null", () => {
		let fs = require("fs");
		let path = "/foo/bar";

		spyOn(fs, "existsSync").and.returnValues(false);

		fetchOptions("/foo/bar");

		expect(fs.existsSync).toHaveBeenCalledWith("/foo/bar/.gitlintrc.js");
		expect(fs.existsSync).toHaveBeenCalledWith("/foo/bar/.gitlintrc.json");
		expect(fs.existsSync).toHaveBeenCalledWith("/foo/.gitlintrc.js");
		expect(fs.existsSync).toHaveBeenCalledWith("/foo/.gitlintrc.json");
		expect(fs.existsSync).toHaveBeenCalledWith("/.gitlintrc.js");
		expect(fs.existsSync).toHaveBeenCalledWith("/.gitlintrc.json");
		expect(fs.existsSync.calls.count()).toEqual(6);
	});

	it("fetch options stops as soon as a root options is provided", () => {
		let fs = require("fs");
		let path = "/foo/bar";
		let expectedOptions = {root: true};

		spyOn(fs, "existsSync").and.returnValues(false, true);
		spyOn(fs, "readFileSync").and.returnValue(JSON.stringify(expectedOptions));

		fetchOptions("/foo/bar");

		expect(fs.existsSync).toHaveBeenCalledWith("/foo/bar/.gitlintrc.js");
		expect(fs.existsSync).toHaveBeenCalledWith("/foo/bar/.gitlintrc.json");
		expect(fs.existsSync.calls.count()).toEqual(2);
	});

	it("fetched options are merged", () => {
		let fs = require("fs");
		let path = "/foo/bar";

		let bottom = {a: 4, b: 5};
		let top = {a: 7, c: 9};
		let expectedOptions = {a: 4, b: 5, c: 9};

		spyOn(fs, "existsSync").and.returnValues(false, true, false, true);
		spyOn(fs, "readFileSync").and.returnValues(JSON.stringify(bottom), JSON.stringify(top));

		expect(fetchOptions("/foo/bar")).toEqual(expectedOptions);
	});

	describe("Windows specific tests", () => {
		if (!isWindows) {
			pending("The host is not a Windows machine");
		}

		it("homeDir equals $USERPROFILE on Windows", () => {
			if (!isWindows) {
				pending("The host is not a Windows machine");
			}

			expect(fetchOptions._homeDir()).toBe(process.env["USERPROFILE"]);
		});

		it("parent directory returns null when reaching C: on Windows", () => {
			if (!isWindows) {
				pending("The host is not a Windows machine");
			}

			let path = "C:";

			expect(fetchOptions._parentDirectory(path)).toBe(null);
		});
	});

	describe("Unix specific tests", () => {
		if (isWindows) {
			pending("The host is not a Unix machine");
		}

		it("homeDir equals $HOME on Unix", () => {
			if (isWindows) {
				pending("The host is not a Unix machine");
			}

			expect(fetchOptions._homeDir()).toBe(process.env["HOME"]);
		});

		it("parent directory returns null when reaching / on Unix", () => {
			if (isWindows) {
				pending("The host is not a Unix machine");
			}

			let path = "/";

			expect(fetchOptions._parentDirectory(path)).toBe(null);
		});
	});
});