let rules = [
	"short-description-length",
	"long-description-length",
	"empty-line"
];

module.exports = {};

for (let rule of rules) {
	module.exports[rule] = require(`./${rule}/${rule}`);
}
