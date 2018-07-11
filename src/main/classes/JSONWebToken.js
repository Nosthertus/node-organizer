const jwt = require("jsonwebtoken");
const Promise = require("bluebird");
const Helper = require("../../../utils/helper");
const env    = process.env.NODE_ENV || "development";
const config = Helper.loadFromRoot("config.json")[env];

const sign = Promise.promisify(jwt.sign);
const verify = Promise.promisify(jwt.verify);

class JSONWebToken {
	/**
	 * Extracts the token from an authorization header format string
	 *
	 * @param   {String} payload The authorization header payload
	 * @return  {*}              The token from the header payload
	 * @private
	 */
	static _getTokenFromAuthorization(payload) {
		if (!payload || !payload.startsWith("Bearer")) {
			return null;
		}

		else {
			return payload.split(" ")[1];
		}
	}

	/**
	 * Encodes an object into JWT
	 *
	 * @param  {Object}       data The object to encode
	 * @param  {String}       time The time in human format or seconds. ex: 1h or 60 * 60
	 * @return {Promise<any>}      The encoded object in JWT
	 */
	static encode(data, time = null) {
		let args = [data, config.secretKey];

		if (time) {
			args.push({expiresIn: time});
		}

		return sign(...args);
	}

	/**
	 * Decodes a JWT string
	 *
	 * @param  {String}       token The encoded token
	 * @return {Promise<any>}       The decoded data
	 */
	static decode(token) {
		return verify(token, config.secretKey);
	}

	/**
	 * Extracts the token from an authorization header string and decodes it
	 *
	 * @param  {String}       payload The authorization header
	 * @return {Promise<any>}         The decoded data
	 */
	static decodeFromAuthorization(payload) {
		const token = this._getTokenFromAuthorization(payload);

		return this.decode(token);
	}
}

module.exports = JSONWebToken;