const BaseError = require("./BaseError");

class UnauthorizedError extends BaseError {
	constructor(message) {
		super(message);

		this.name = "UnauthorizedError";
	}
}

module.exports = UnauthorizedError;