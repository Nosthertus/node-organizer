const supertest = require("supertest");
const chai      = require("chai");
const sinon     = require("sinon");
const Helper    = require("./../../../utils/helper");
const app       = Helper.loadFromRoot("index");
const expect    = chai.expect;

const projectsController = Helper.loadController("projects");

const NotFoundResource = Helper.loadError("NotFoundResource");
const InvalidBodyError = Helper.loadError("InvalidBodyError");

describe("Project route testing", () => {
	let sandbox;
	let baseUri = "/api/projects";
	let request = supertest(app);

	beforeEach(() => {
		sandbox = sinon.createSandbox();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe("GET /projects", () => {
		it("should respond with a list of projects", () => {
			const uri = `${baseUri}/`;

			sandbox.stub(projectsController, "getAll").resolves(new Array(3));

			return request.get(uri)
				.expect(200)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.be.instanceOf(Array)
						.and.have.lengthOf(3);
				});
		});

		it("should respond with project data", () => {
			const uri = `${baseUri}/3`;

			sandbox.stub(projectsController, "getById").resolves({id: 3});

			return request.get(uri)
				.expect(200)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.have.property("id", 3);
				});
		});

		it("should respond with error if no project is found", () => {
			const uri = `${baseUri}/3`;

			sandbox.stub(projectsController, "getById").rejects(new NotFoundResource());

			return request.get(uri)
				.expect(404)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.have.property("name", "NotFoundResource");
				});
		});
	});

	describe("POST /projects", () => {
		it("should respond with success on creating a new project", () => {
			const uri = baseUri;
			const data = {name: "random"};

			sandbox.stub(projectsController, "create").resolves(data);

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

			sandbox.stub(projectsController, "create").rejects(new InvalidBodyError());

			return request.post(uri)
				.send(data)
				.expect(409)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.have.property("name", "InvalidBodyError");
				});
		});
	});

	describe("PATCH /projects", () => {
		it("should respond with success on updating a project data", () => {
			const uri = `${baseUri}/3`;
			const data = {
				name: "new name",
				description: "new description"
			};

			sandbox.stub(projectsController, "getById").resolves({id: 3});
			sandbox.stub(projectsController, "update").resolves(data);

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

			sandbox.stub(projectsController, "getById").resolves({id: 3});
			sandbox.stub(projectsController, "update").rejects(new InvalidBodyError());

			return request.patch(uri)
				.expect(409)
				.expect("Content-Type", /json/)
				.then(response => {
					return expect(response.body).to.have.property("name", "InvalidBodyError");
				});
		});
	});

	describe("DELETE /projects", () => {
		it("should respond with success on deleting a project", () => {
			const uri = `${baseUri}/3`;

			sandbox.stub(projectsController, "getById").resolves({id: 3});
			sandbox.stub(projectsController, "deleteById").resolves();

			return request.delete(uri)
				.expect(200);
		});
	});
});