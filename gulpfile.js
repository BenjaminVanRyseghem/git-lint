let gulp = require("gulp");
let reporters = require("jasmine-reporters");
let del = require("del");

let plugins = require("gulp-load-plugins")({
	rename: {
		"gulp-eslint": "eslint",
		"gulp-jasmine": "jasmine",
		"gulp-flatmap": "flatmap",
		"gulp-istanbul": "istanbul",
		"gulp-codacy": "codacy",
		"grunt-strip-code": "stripCode"
	}
});

let sources = ["./bin/gitlint", "./bin/**/*.js", "./lib/**/*.js"];
let tests = ["./tests/**/*Spec.js"];
let misc = ["./gulpfile.js", "./.eslintrc.js"];
let all = sources.slice().concat(tests).concat(misc);

gulp.task("default", ["lint", "tests"]);

gulp.task("js-lint", () => {
	var pipeline = gulp.src(all)
		.pipe(plugins.eslint())
		.pipe(plugins.eslint.format("unix"))
		.pipe(plugins.eslint.failAfterError());

	return pipeline;
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
	return gulp.src(tests)
		.pipe(plugins.jasmine());
});

//
// Deploy
//

gulp.task("build", function() {
	gulp.src(sources)
		.pipe(plugins.stripCode({
			start_comment: "start-test",
			end_comment: "end-test"
		}))
		.pipe(gulp.dest("build"));
});

//
// Clean
//

gulp.task("clean", (cb) => {
	del([
		"build"
	], cb);
});
