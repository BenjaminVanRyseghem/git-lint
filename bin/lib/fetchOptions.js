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

function isWindows() {
	return process.platform === "win32" || process.platform === "win64";
}

function getHomeEnvVarName() {
	return isWindows() ? "USERPROFILE" : "HOME";
}

function homeDir() {
	return process.env[getHomeEnvVarName()];
}

/**
 *
 * @param {Object} bottom Options thes closest from the original dirctory. Therefore this is the object with the higher priority.
 * @param {Object} top New options to merge. Thes object as the lower priority.
 * @returns {Object} A new object with the `bottom` and `top` properties
 */
function mergeOptions(bottom, top) {
	if (bottom === null && top === null) {
		return null;
	}

	if (bottom === null || top === null) {
		return Object.assign({}, bottom || top);
	}

	let result = Object.assign({}, bottom);

	for (let key of Object.keys(top)) {
		let value = top[key];

		if (bottom[key] === undefined) {
			result[key] = value;
		} else if (isObjLiteral(value) && isObjLiteral(bottom[key])) {
			// deep merge
			result[key] = mergeOptions(bottom[key], value);
		}
	}

	return result;
}

function isObjLiteral(_obj) {
	let _test = _obj;

	if (typeof _obj !== "object" || _obj === null) {
		return false;
	}

	return (function() {
		while (true) { // eslint-disable-line no-constant-condition
			if (Object.getPrototypeOf(_test = Object.getPrototypeOf(_test)) === null) {
				break;
			}
		}
		return Object.getPrototypeOf(_obj) === _test;
	})();
}

function fetchOptions(originalDir) {
	let options = null;
	let currentDir = originalDir;
	let rootDir = homeDir();

	while ((!options || !options.root) && currentDir && currentDir !== rootDir) {
		let localOptions = findLocalOption(currentDir);

		options = mergeOptions(options, localOptions);
		currentDir = parentDirectory(currentDir);
	}

	return options;
}

module.exports = fetchOptions;

/* start-test */
module.exports._readJsonOptions = readJsonOptions;
module.exports._readJSOptions = readJSOptions;
module.exports._findLocalOption = findLocalOption;
module.exports._parentDirectory = parentDirectory;
module.exports._homeDir = homeDir;
module.exports._mergeOptions = mergeOptions;
module.exports._isObjLiteral = isObjLiteral;
module.exports._getHomeEnvVarName = getHomeEnvVarName;
module.exports._isWindows = isWindows;
/* end-test */
