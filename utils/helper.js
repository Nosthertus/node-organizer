const path = require("path");

const root = path.join(__dirname, "../");

class Helper {
	/**
	 * Loads the file within the src or test directory
	 *
	 * @param   {String}  filename The name of the file to load
	 * @param   {String}  dirname  The sub-directory where the file is contained
	 * @param   {Boolean} testPath Whether the file should be required from src or test directory
	 * @return  {*}                The require result of the file
	 * @private
	 */
	static _loadCode(filename, dirname, testPath = false) {
		let basePath;

		if (testPath === true) {
			basePath = path.join(root, "tests/main");
		}

		else {
			basePath = path.join(root, "src/main");
		}

		return require(path.join(basePath, dirname, filename));
	}

	/**
	 * Loads the controller file
	 *
	 * @param  {String}  name     The name of the file to load
	 * @param  {Boolean} testPath Whether the file should be loaded in test directory
	 * @return {*}                The require result of the file
	 */
	static loadController(name, testPath = false) {
		return this._loadCode(name, "controllers", testPath);
	}

	/**
	 * Loads the error file
	 *
	 * @param  {String} name The name of the file to load
	 * @return {*}           The require result of the file
	 */
	static loadError(name) {
		let basePath = path.join(root, "src/main/errors");

		return require(path.join(basePath, name));
	}

	static loadModel(name, testPath) {
		return this._loadCode(name, "controllers", testPath);
	}

	static loadRoute(name, testPath) {
		return this._loadCode(name, "routers", testPath);
	}

	/**
	 * Loads the connection file in src/main
	 *
	 * @returns {*} The require result of the file
	 */
	static loadConnection() {
		return require(path.join(root, "src/main/connection"));
	}

	static loadFromRoot(dir) {
		return require(path.join(root, dir));
	}
}

module.exports = Helper;