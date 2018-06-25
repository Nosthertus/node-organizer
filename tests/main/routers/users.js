const supertest = require("supertest");
const chai      = require("chai");
const sinon     = require("sinon");
const Helper    = require("./../../../utils/helper");
const app       = Helper.loadFromRoot("index");
const expect    = chai.expect;

const usersController = Helper.loadController("users");

const NotFoundResource = Helper.loadError("NotFoundResource");
const InvalidBodyError = Helper.loadError("InvalidBodyError");

describe("Users route testing", function(){
	let uri = "/api/users";
	let agent = supertest.agent(app);
	let sandbox;

	beforeEach(function(){
		sandbox = sinon.createSandbox();

		sandbox.stub(usersController, "getById").resolves({ id: 4, type: "professional" });
	});

	afterEach(function(){
		sandbox.restore();
	});

	describe("PATCH /user", function() {
		it("should respond with success on updating user data", function(){
			sandbox.stub(usersController, "update").resolves({ username: "random" });

			return agent.patch(`${uri}/1`)
				.type("form")
				.send({ username: "random" })
				.set("Accept", /application\/json/)
				.expect(200)
				.then(response => {
					return expect(response.body).to.be.an.instanceOf(Object)
						.and.have.property("username", "random");
				});
		});

		it("should respond with error when updating invalid field from user data", function(){
			sandbox.stub(usersController, "update").rejects(new InvalidBodyError());

			return agent.patch(`${uri}/1`)
				.type("form")
				.send({ username: {} })
				.set("Accept", /application\/json/)
				.expect(409)
				.then(response => {
					return expect(response.body).to.have.property("name", "InvalidBodyError");
				});
		});
	});

	describe("GET /user",function(){
		it("should respond with user data", function () {
			return agent.get(`${uri}/4`)
				.expect("Content-Type", /json/)
				.expect(200);
		});

		it("should respond with not found on user", function () {
			sandbox.restore();

			sandbox.stub(usersController, "getById").rejects(new NotFoundResource("user no found"));

			return agent.get(`${uri}/6`)
				.expect(404)
				.then(response => {
					expect(response.body).to.have.property("name", "NotFoundResource");
				});
		});

		it("should respond with a list of users with search", function () {
			sandbox.stub(usersController, "getAll").resolves(new Array(4));

			return agent.get(uri)
				.query({ search: "lorem" })
				.expect("Content-Type", /json/)
				.expect(200)
				.then(response => {
					const call = usersController.getAll.getCall(0);

					expect(call.args[0]).to.be.equal("lorem");
					expect(response.body).to.be.an.instanceOf(Array)
						.and.have.lengthOf(4);
				});
		});

		it("should respond with a list of all users", function () {
			sandbox.stub(usersController, "getAll").resolves(new Array(6));

			return agent.get(uri)
				.expect("Content-Type", /json/)
				.expect(200)
				.then((response) => {
					const call = usersController.getAll.getCall(0);

					expect(call.args[0]).to.be.undefined;
					expect(response.body).to.be.an.instanceOf(Array)
						.and.have.lengthOf(6);
				});
		});
	});
});