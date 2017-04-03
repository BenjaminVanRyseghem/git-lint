const fs = require("fs");

function main(path) {
	let string = fs.readFileSync(path);
	let packageInfo = JSON.parse(string);

	packageInfo.longCopyright = `Copyright © ${packageInfo.year} ${packageInfo.author.name}`;
	packageInfo.longCopyright += `<${packageInfo.author.email}>`;

	packageInfo.longLicense = `Licence ${packageInfo.license} (${packageInfo.licenseUrl})`;

	let longVersion = `${packageInfo.name} v${packageInfo.version}\n`;
	longVersion += `${packageInfo.longCopyright}\n`;
	longVersion += `${packageInfo.longLicense}`;

	packageInfo.longVersion = longVersion;

	return packageInfo;
}

module.exports = main;
