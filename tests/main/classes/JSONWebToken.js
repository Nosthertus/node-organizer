const Helper = require("../../../utils/helper");
const chai = require("chai");
const promised = require("chai-as-promised");
const expect = chai.expect;

chai.use(promised);

const JSONWebToken = Helper._loadCode("JSONWebToken", "classes");

describe("JSONWebToken class test", () => {
	const testData = {foo: "bar"};

	it("should return a promise", () => {
		const data = JSONWebToken.encode({});

		return expect(typeof data.then).to.be.equal("function");
	});

	it("should successfully encode a payload data", () => {
		return expect(JSONWebToken.encode(testData)).to.eventually.be.fulfilled;
	});

	it("should successfully encode a payload data with expiration time", () => {
		const expireTime = Math.floor(Date.now() / 1000) + (60 * 60);

		return JSONWebToken.encode(testData, "1h")
			.then(token => JSONWebToken.decode(token))
			.then(data => {
				return expect(data).to.have.property("exp", expireTime);
			});
	});

	it("should successfully decode a token", () => {
		return JSONWebToken.encode(testData)
			.then(token => {
				return expect(JSONWebToken.decode(token)).to.eventually.be.fulfilled
					.and.include(testData);
			});
	});

	it("should extract token from authorization payload header", () => {
		const testToken = "asdfghkmb";
		const header = `Bearer ${testToken}`;

		return expect(JSONWebToken._getTokenFromAuthorization(header)).to.be.equal(testToken);
	});

	it("should return null when authorization header format is invalid", () => {
		return expect(JSONWebToken._getTokenFromAuthorization("asdl")).to.be.null;
	});

	it("should decode token from authorization header", () => {
		return JSONWebToken.encode(testData)
			.then(token => {
				const header = `Bearer ${token}`;

				return JSONWebToken.decodeFromAuthorization(header);
			}).then(data => {
				return expect(data).to.include(testData);
			});
	});

	it("should throw a JWT error", () => {
		return expect(JSONWebToken.decode("foo")).to.eventually.be.rejected
			.and.have.property("name", "JsonWebTokenError");
	});
});