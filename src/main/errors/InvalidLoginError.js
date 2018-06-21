const BaseError = require("./BaseError");

class InvalidLoginError extends BaseError {
	constructor(message) {
		super(message);

		this.name = "InvalidLoginError";
	}
}

module.exports = InvalidLoginError;