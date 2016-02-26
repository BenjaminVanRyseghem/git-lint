"use strict";

const fs = require("fs");
const path = require("path");

function readJsonOptions(filePath) {
	let json = fs.readFileSync(filePath, "utf8");
	return JSON.parse(json);
}

function readJSOptions(filePath) {
	return require(filePath);
}

function findLocalOption(dir) {
	let filePath = path.resolve(dir, ".gitlintrc.js");
	if (fs.existsSync(filePath)) {
		return readJSOptions(filePath);
	}

	filePath = path.resolve(dir, ".gitlintrc.json");
	if (fs.existsSync(filePath)) {
		return readJsonOptions(filePath);
	}

	return null;
}

function parentDirectory(dir) {
	let parent = path.resolve(dir, "..");

	// If the parent equals dir, it means we reached the top of the file system.
	// It could happen in the case a user run the script targeting a file under another use home.
	// Or if you target a file in a non-primary disk on Windows (I imagine).
	return dir === parent ? null : parent;
}

function homeDir() {
	let isWindows = process.platform === "win32" || process.platform === "win64";
	let envVarName = isWindows ? "USERPROFILE" : "HOME";

	return process.env[envVarName];
}

function mergeOptions(bottom, top) {
	if (bottom === top === null) {
		return null;
	}

	return Object.assign({}, bottom, top);
}

function fetchOptions(originalDir) {
	let options = null;
	let currentDir = originalDir;
	let rootDir = homeDir();

	while ((!options || !options.root) && currentDir !== rootDir) {
		let localOptions = findLocalOption(currentDir);

		// The previous options were closer from the original source,
		// therefore they are more important.
		options = mergeOptions(localOptions, options);
		currentDir = parentDirectory(currentDir);
	}

	return options;
}

module.exports = fetchOptions;