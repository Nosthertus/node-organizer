const BaseError = require("./BaseError");

class SessionExpiredError extends BaseError{
	constructor(message, timeExpired) {
		super(message);

		this.expiredAt = timeExpired;
	}
}

module.exports = SessionExpiredError;