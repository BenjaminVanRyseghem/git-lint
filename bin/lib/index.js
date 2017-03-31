"use strict";

const fs = require("fs");
const path = require("path");

const fetchOptions = require("./fetchOptions");
const loadPlugins = require("./loadPlugins");
const output = require("./output");
const cli = require("./cli");
const gitlint = require("../../lib/gitlint");
const Git = require("nodegit");

function findExtraRule(dir, name) {
	let rulePath = path.resolve(dir, name);

	try {
		return require(rulePath);
	} catch (e) {
		return null;
	}
}

function getAllExtraRules(dir) {
	let result = {};

	if (!dir) {
		return result;
	}

	let fileNames = fs.readdirSync(dir);

	for (let fileName of fileNames) {
		if (path.extname(fileName) === ".js") {
			let name = path.basename(fileName);
			let fn = findExtraRule(dir, name);
			if (fn) {
				result[name] = fn;
			}
		}
	}

	return result;
}

function main() {
	let args = cli.getArguments();

	if (args["no-git-context"]) {
		analyzeMessage(args.src, args, {});
		return;
	}

	let gitContext = {};

	Git.Repository.open(".").then(function(repo) {
		gitContext.repository = repo;
		return repo.getCurrentBranch();
	}).then(function(branch) {
		gitContext.branch = branch;
		return gitContext.repository.getHeadCommit();
	}).then(function(commit) {
		return commit.getTree();
	}).then(function(tree) {
		return Git.Diff.treeToIndex(gitContext.repository, tree, "HEAD");
	}).then(function(diff) {
		return diff.patches();
	}).then(function(arrayConvenientPatch) {
		gitContext.patches = arrayConvenientPatch;
		analyzeMessage(args.src, args, gitContext);
	}).catch(function(reasonForFailure) {
		output.error(reasonForFailure.message);
		process.exit(1);
	});
}

function analyzeMessage(commitMessageTmpFile, cliOptions, gitContext) {
	if (!commitMessageTmpFile || !fs.existsSync(commitMessageTmpFile)) {
		cli.displayHelp();
		process.exit(1);
	}

	let dir = path.dirname(commitMessageTmpFile);
	let options = fetchOptions(dir);

	let message = fs.readFileSync(commitMessageTmpFile, "utf8");
	let extraContext = {
		git: gitContext,
		file: path.resolve(commitMessageTmpFile),
		cliOptions
	};

	options.pluginRules = loadPlugins(options);
	options.extraRules = getAllExtraRules(options.rulesdir);

	// let options = {};

	let result = gitlint(message, options, extraContext);
	output(result);

	process.exit(result.isErrored() ? 1 : 0);
}

module.exports = main;