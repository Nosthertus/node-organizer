const helper = require("./../../../utils/helper");

const JSONWebtoken        = helper._loadCode("JSONWebToken", "classes");
const UnauthorizedError   = helper.loadError("UnauthorizedError");
const SessionExpiredError = helper.loadError("SessionExpiredError");

const nonSecuredPaths = [
	"/auth/create",
	"/auth/register"
];

/**
 * Authentication middleware for express
 * This verifies if the requested path is granted
 */
module.exports = (request, response, next) => {
	let insecure = Authentication.isNonSecured(request.path);

	if (!insecure) {
		Authentication.handleSession(request, next);
	}

	else {
		next();
	}
};

class Authentication {
	/**
	 * Checks if the provided uri is secured
	 *
	 * @param  {String}  uri The requested uri
	 * @return {Boolean}     Whether the uri is secured
	 */
	static isNonSecured(uri) {
		let found = nonSecuredPaths.find(p => {
			return uri.startsWith(p);
		});

		return found != null;
	}

	/**
	 * Handles the session token from the authorization header
	 * this should properly call the proper middleware for both errors and success decoding
	 *
	 * @param {Request}  request The request object
	 * @param {Function} next    The next function for the next middleware
	 */
	static handleSession(request, next) {
		return JSONWebtoken.decodeFromAuthorization(request.get("Authorization")).then(token => {
			request.session = token;
			next();
		}).catch(_error => {
			switch (_error.name) {
				case "JsonWebTokenError":
					next(new UnauthorizedError());
					break;

				case "TokenExpiredError":
					const error = new SessionExpiredError("Authorization token expired", _error.expiredAt);
					next(error);
					break;

				default:
					next(_error);
			}
		});
	}
}

if (typeof it !== "undefined") {
	module.exports._Authentication = Authentication;
}