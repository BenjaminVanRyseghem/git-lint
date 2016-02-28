"use strict";

const commandLineArgs = require('command-line-args');
const info = require("./appInfo");
const output = require("./output");

const cli = commandLineArgs([
	{
		name: "help",
		alias: "h",
		type: Boolean,
		description: "Display this text"
	},
	{
		name: 'verbose',
		alias: 'V',
		type: Boolean,
		description: "Output more information"
	},
	{
		name: 'version',
		alias: 'v',
		type: Boolean,
		description: "Display the version text"
	},
	{
		name: 'src',
		type: String,
		defaultOption: true,
		description: "Message to lint"
	},
	{
		name: 'no-git-context',
		type: Boolean,
		description: "Deactivate the git context"
	}
]);

const usageOptions = {
	title: info.name,
	description: info.description,
	synopsis: [
		"$ gitlint [bold]{--verbose} path/to/my/file"
	]
};

function displayHelp() {
	console.log(cli.getUsage(usageOptions));
}

function displayVersion() {
	console.log(info.longVersion);
}

function getArguments() {
	let options;
	try {
		options = cli.parse();
	} catch (e) {
		output.error(e.message);
		displayHelp();
		process.exit(1);
	}

	if (options.help) {
		displayHelp();
		process.exit(0);
	}

	if (options.version) {
		displayVersion();
		process.exit(0);
	}

	return options;
}

module.exports = {
	displayHelp: displayHelp,
	getArguments: getArguments
};