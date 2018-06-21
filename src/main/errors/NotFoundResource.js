const BaseError = require("./BaseError");

class NotFoundResource extends BaseError {
	constructor(message) {
		super(message);

		this.name = "NotFoundResource";
	}
}

module.exports = NotFoundResource;