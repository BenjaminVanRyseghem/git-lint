let moduleSpies = {};
let originalJsLoader = require.extensions[".js"];

global.spyOnModule = function spyOnModule(module) {
	let path = require.resolve(module);
	let spy = jasmine.createSpy("spy on module \"" + module + "\"");
	moduleSpies[path] = spy;
	delete require.cache[path];
	return spy;
};

require.extensions[".js"] = function(obj, path) { // eslint-disable-line consistent-return
	if (moduleSpies[path]) {
		obj.exports = moduleSpies[path];
	} else {
		return originalJsLoader(obj, path);
	}
};

afterEach(function() { // eslint-disable-line jasmine/no-global-setup
	for (let path in moduleSpies) {
		delete moduleSpies[path];
	}
});
