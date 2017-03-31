let moduleSpies = {};
let originalJsLoader = require.extensions['.js'];

spyOnModule = function spyOnModule(module) {
	let path = require.resolve(module);
	let spy = jasmine.createSpy("spy on module \"" + module + "\"");
	moduleSpies[path] = spy;
	delete require.cache[path];
	return spy;
};

require.extensions['.js'] = function(obj, path) {
	if (moduleSpies[path]) {
		obj.exports = moduleSpies[path];
	} else {
		return originalJsLoader(obj, path);
	}
};

afterEach(function() {
	for (let path in moduleSpies) {
		delete moduleSpies[path];
	}
});