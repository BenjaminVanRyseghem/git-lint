"use strict";

let gulp = require("gulp");
let reporters = require("jasmine-reporters");
let del = require("del");

let packageInfo = require("./package.json");

let plugins = require("gulp-load-plugins")({
	rename: {
		"gulp-eslint": "eslint",
		"gulp-jasmine": "jasmine",
		"gulp-istanbul": "istanbul",
		"gulp-codacy": "codacy",
		"grunt-strip-code": "stripCode"
	}
});

let sources = ["./bin/gitlint", "./bin/**/*.js"];
let tests = ["./tests/**/*.js"];
let all = sources.slice().concat(tests);

gulp.task("default", ["lint", "tests"]);

gulp.task("js-lint", () => {
	return gulp.src(all)
		.pipe(plugins.eslint())
		.pipe(plugins.eslint.format())
		.pipe(plugins.eslint.failAfterError());
});

gulp.task("lint", ["js-lint"]);

// Tests

gulp.task("pre-test", () => {
	return gulp.src(sources)
		.pipe(plugins.istanbul())
		.pipe(plugins.istanbul.hookRequire());
});

gulp.task("tests", ["pre-test"], () => {
	return gulp.src(tests)
		.pipe(plugins.jasmine({
			reporter: new reporters.TerminalReporter()
		}))
		.pipe(plugins.istanbul.writeReports());
	// .pipe(plugins.istanbul.enforceThresholds({thresholds: {global: 90}}));
});

gulp.task("jasmine", () => {
	return gulp.src(all)
		.pipe(plugins.jasmineBrowser.specRunner())
		.pipe(plugins.jasmineBrowser.server({port: 8888}));
});

// Coverage

gulp.task("basic-coverage", () => {
	return gulp.src("").pipe(plugins.shell("istanbul cover ./node_modules/.bin/jasmine --captureExceptions")
	);
});

gulp.task("coveralls", ["basic-coverage"], () => {
	return gulp.src("").pipe(plugins.shell("cat <%= info %> | <%= coveralls %>", {
			templateData: {
				info: "./coverage/lcov.info",
				coveralls: "./node_modules/coveralls/bin/coveralls.js"
			}
		})
	);
});

// gulp.task("codacy", ["basic-coverage"], () => {
// 	return gulp
// 		.src(["./coverage/lcov.info"], {read: false})
// 		.pipe(plugins.codacy({
// 			token: process.env.CODACY_TOKEN
// 		}));
// });

// gulp.task("coverage", ["coveralls", "codacy"], () => {
gulp.task("coverage", ["coveralls"], () => {
	return gulp.src("").pipe(plugins.shell("rm -rf ./coverage"));
});

//
// Deploy
//

gulp.task('build', function() {
	gulp.src(sources)
		.pipe(plugins.stripCode({
			start_comment: "start-test",
			end_comment: "end-test"
		}))
		.pipe(gulp.dest('build'));
});

//
// Clean
//

gulp.task("clean", (cb) => {
	del([
		"build"
	], cb);
});