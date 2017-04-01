module.exports = {
	root: true,
	formatter: "unix",
	plugins: [
		"jasmine"
	],
	extends: [
		"eslint:recommended",
		"plugin:jasmine/recommended"
	],
	env: {
		jasmine: true,
		node: true,
		es6: true
	},
	rules: {
		"array-callback-return": 2,
		"consistent-return": "error",
		"curly": "error",
		"default-case": "error",
		"eol-last": ["error", "unix"],
		"eqeqeq": "error",
		"func-style": ["error", "declaration"],
		"jasmine/no-suite-dupes": "error",
		"jasmine/no-spec-dupes": "error",
		"jasmine/valid-expect": "error",
		"jasmine/no-unsafe-spy": 0,
		"keyword-spacing": "error",
		"linebreak-style": ["error", "unix"],
		"no-alert": "error",
		"no-eval": "error",
		"no-labels": "error",
		"no-lone-blocks": "error",
		"no-multiple-empty-lines": ["error", {max: 1}],
		"no-multi-spaces": "error",
		"no-return-assign": "error",
		"no-self-compare": "error",
		"no-sequences": "error",
		"no-trailing-spaces": "error",
		"no-unused-vars": ["error", {args: "none"}],
		"no-useless-call": "error",
		"no-use-before-define": ["error", "nofunc"],
		"one-var": ["error", "never"],
		"quotes": ["error", "double"],
		"semi": ["error", "always"],
		"semi-spacing": ["error", {"before": false, "after": true}],
		"space-before-function-paren": ["error", "never"],
		"space-infix-ops": "error",
		"strict": ["error", "never"],
		"wrap-iife": ["error", "inside"],
		"yoda": "error"
	}
};
