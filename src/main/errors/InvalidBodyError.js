const BaseError = require("./BaseError");
const _ = require("underscore");

class InvalidBodyError extends BaseError {
	constructor(message, fields) {
		super(message);

		this.name = "InvalidBodyError";

		if (!_.isUndefined(fields)) {
			this.errors = fields;
		}
	}
}

module.exports = InvalidBodyError;