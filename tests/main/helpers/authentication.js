const sinon = require("sinon");
const chai = require("chai");
const promised = require("chai-as-promised");
const Helper = require("./../../../utils/helper");
const assert = chai.assert;
const expect = chai.expect;

const authentication = Helper._loadCode("authentication", "helpers");
const JSONWebToken = Helper._loadCode("JSONWebToken", "classes");
const Authentication = authentication._Authentication;

const UnauthorizedError = Helper.loadError("UnauthorizedError");
const SessionExpiredError = Helper.loadError("SessionExpiredError");

chai.use(promised);

describe("Authentication handler test", () => {
	let sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it("should let insecure requests to be accepted", () => {
		sandbox.stub(Authentication, "isNonSecured").returns(true);

		authentication({}, {}, function(){});

		const called = Authentication.isNonSecured.calledWith();

		assert.isTrue(called);
	});

	it("should handle session if non-secured api route is requested", () => {
		const request = { path: "/api/test" };

		sandbox.stub(Authentication, "handleSession").returns();
		sandbox.stub(Authentication, "isNonSecured").returns(false);

		authentication(request, {}, {});

		const called = Authentication.handleSession.calledWith(request, {});

		assert.isTrue(called);
	});

	it("should return true if method \"isNonSecured\" finds in list of non-secured routes the provided route", () => {
		const path = "/auth/create";
		const result = Authentication.isNonSecured(path);

		assert.isTrue(result);
	});

	it("should resolve session when token was successfully decoded", () => {
		const spy = sinon.spy();
		const request = { get: sinon.spy() };

		sandbox.stub(JSONWebToken, "decodeFromAuthorization").resolves({});

		return expect(Authentication.handleSession(request, spy)).to.be.eventually.fulfilled
			.then(() => {
				assert.isTrue(spy.calledWith());
			});
	});

	it("should call error middleware with \"UnauthorizedError\" if token is not able to be decoded", () => {
		const spy = sinon.spy();
		const request = { get: sinon.spy() };
		const error = { name: "JsonWebTokenError" };

		sandbox.stub(JSONWebToken, "decodeFromAuthorization").rejects(error);

		return expect(Authentication.handleSession(request, spy)).to.be.eventually.fulfilled
			.then(() => {
				const call = spy.getCall(0);

				assert.instanceOf(call.args[0], UnauthorizedError);
			});
	});

	it("should call error middleware with \"SessionExpiredError\" if token is expired", () => {
		const spy = sinon.spy();
		const request = { get: sinon.spy() };
		const error = { name: "TokenExpiredError", expiredAt: 121351 };

		sandbox.stub(JSONWebToken, "decodeFromAuthorization").rejects(error);

		return expect(Authentication.handleSession(request, spy)).to.be.eventually.fulfilled
			.then(() => {
				const call = spy.getCall(0);
				const arg = call.args[0];

				assert.instanceOf(arg, SessionExpiredError);
				assert.propertyVal(arg, "expiredAt", error.expiredAt);
			});
	});

	it("should error middleware with unhandled error", () => {
		const spy = sinon.spy();
		const request = { get: sinon.spy() };
		const error = new Error("test");

		sandbox.stub(JSONWebToken, "decodeFromAuthorization").rejects(error);

		return expect(Authentication.handleSession(request, spy)).to.be.eventually.fulfilled
			.then(() => {
				assert.isTrue(spy.calledWith(error));
			});
	});
});