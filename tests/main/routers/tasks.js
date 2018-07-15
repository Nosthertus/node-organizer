const supertest = require("supertest");
const chai      = require("chai");
const sinon     = require("sinon");
const Helper    = require("./../../../utils/helper");
const app       = Helper.loadFromRoot("index");
const expect    = chai.expect;

const taskController = Helper.loadController("tasks");

const NotFoundResource = Helper.loadError("NotFoundResource");
const InvalidBodyError = Helper.loadError("InvalidBodyError");

const JSONWebToken = Helper._loadCode("JSONWebToken", "classes");

describe("Task route testing", () => {
	let sandbox;
	let baseUri = "/api/tasks";
	let request = supertest(app);

	beforeEach(() => {
		sandbox = sinon.createSandbox();

		sandbox.stub(JSONWebToken, "decodeFromAuthorization").resolves();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe("GET /tasks", () => {
		it("should respond with a list of tasks", () => {
			const uri = `${baseUri}/`;

			sandbox.stub(taskController, "getAll").resolves(new Array(3));

			return request.get(uri)
				.expect(200)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.be.instanceOf(Array)
						.and.have.lengthOf(3);
				});
		});

		it("should respond with task data", () => {
			const uri = `${baseUri}/3`;

			sandbox.stub(taskController, "getById").resolves({id: 3});

			return request.get(uri)
				.expect(200)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.have.property("id", 3);
				});
		});

		it("should respond with error if no task is found", () => {
			const uri = `${baseUri}/3`;

			sandbox.stub(taskController, "getById").rejects(new NotFoundResource());

			return request.get(uri)
				.expect(404)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.have.property("name", "NotFoundResource");
				});
		});
	});

	describe("POST /tasks", () => {
		it("should respond with success on creating a new task", () => {
			const uri = baseUri;
			const data = {name: "random"};

			sandbox.stub(taskController, "create").resolves(data);

			return request.post(uri)
				.send(data)
				.expect(201)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.be.eql(data);
				});
		});

		it("should respond with error if create data is invalid", () => {
			const uri = baseUri;
			const data = {foo: "bar"};

			sandbox.stub(taskController, "create").rejects(new InvalidBodyError());

			return request.post(uri)
				.send(data)
				.expect(409)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.have.property("name", "InvalidBodyError");
				});
		});
	});

	describe("PATCH /tasks", () => {
		it("should respond with success on updating a task data", () => {
			const uri = `${baseUri}/3`;
			const data = {
				name: "new name",
				description: "new description"
			};

			sandbox.stub(taskController, "getById").resolves({id: 3});
			sandbox.stub(taskController, "update").resolves(data);

			return request.patch(uri)
				.send(data)
				.expect(200)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.be.eql(data);
				});
		});

		it("should respond with error if update data is invalid", () => {
			const uri = `${baseUri}/3`;
			const data = {foo: "bar"};

			sandbox.stub(taskController, "getById").resolves({id: 3});
			sandbox.stub(taskController, "update").rejects(new InvalidBodyError());

			return request.patch(uri)
				.expect(409)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.have.property("name", "InvalidBodyError");
				});
		});
	});

	describe("DELETE /tasks", () => {
		it("should respond with success on deleting a task", () => {
			const uri = `${baseUri}/3`;

			sandbox.stub(taskController, "getById").resolves({id: 3});
			sandbox.stub(taskController, "deleteById").resolves();

			return request.delete(uri)
				.expect(200);
		});
	});
});