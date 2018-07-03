const supertest = require("supertest");
const chai      = require("chai");
const sinon     = require("sinon");
const Helper    = require("./../../../utils/helper");
const app       = Helper.loadFromRoot("index");
const expect    = chai.expect;

const usersController = Helper.loadController("users");

const InvalidBodyError = Helper.loadError("InvalidBodyError");
const InvalidLoginError = Helper.loadError("InvalidLoginError");
const UnauthorizedError = Helper.loadError("UnauthorizedError");
const JSONWebToken = Helper._loadCode("JSONWebToken", "classes");

describe("Auth route testing", () => {
	let baseUri = "/api/auth";
	let request = supertest(app);
	let sandbox;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe("POST /auth", () => {
		it("should respond with success on register a new user", () => {
			const uri = `${baseUri}/register`;

			sandbox.stub(usersController, "create").resolves({});

			return request.post(uri)
				.expect(201)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.be.eql({});
				});
		});

		it("should respond with a token auth on create session success", () => {
			const uri = `${baseUri}/create`;

			sandbox.stub(usersController, "login").resolves({id: 3});

			return request.post(uri)
				.send({email: "test@mock.com", password: "random"})
				.expect(200)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.have.property("token");
				});
		});

		it("should respond with user data when resolving the session with token", () => {
			const uri = `${baseUri}/resolve`;

			sandbox.stub(JSONWebToken, "decodeFromAuthorization").resolves({id: 3});
			sandbox.stub(usersController, "getById").resolves({test: true});

			return request.get(uri)
				.expect(200)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.have.property("test");
				});
		});

		it("should respond with error when attempting to resolve the session with token", () => {
			const uri = `${baseUri}/resolve`;
			const error = new UnauthorizedError();

			sandbox.stub(JSONWebToken, "decodeFromAuthorization").rejects(error);

			return request.get(uri)
				.expect(401)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.have.property("name", "UnauthorizedError");
				});
		});

		it("should respond with error on failing to create session token", () => {
			const uri = `${baseUri}/create`;
			const error = new InvalidLoginError("Email or Password is incorrect")

			sandbox.stub(usersController, "login").rejects(error);

			return request.post(uri)
				.send({})
				.expect(401)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.have.property("name", "InvalidLoginError");
				});
		});

		it("should respond with error on failing to register a new user", () => {
			const uri = `${baseUri}/register`;
			const objError = {
				field: "foo",
				message: "Invalid Value"
			};
			const error = new InvalidBodyError("Random Error", [objError]);

			sandbox.stub(usersController, "create").rejects(error);

			return request.post(uri)
				.expect(409)
				.expect("Content-Type", /json/)
				.then(response => {
					const body = response.body;
					const expectedObj = {
						name: "InvalidBodyError",
						message: "Random Error",
						errors: [objError]
					};

					return expect(body).to.eql(expectedObj);
				});
		});
	});
});
