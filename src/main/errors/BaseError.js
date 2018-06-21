const _ = require("underscore");

class BaseError extends Error {
	constructor(message) {
		super(message);

		this.name = "BaseError";

		Error.captureStackTrace(this, this.constructor);
	}

	/**
	 * Returns a simple JSON object of the class instance
	 */
	toJSON() {
		let properties = ["name", "message", "errors"];
		let errorObject = {};

		properties.forEach(property => {
			if (!_.isUndefined(this[property])) {
				errorObject[property] = this[property];
			}
		});

		return errorObject;
	}
}

module.exports = BaseError;