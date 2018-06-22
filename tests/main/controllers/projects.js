const chai      = require("chai");
const path      = require("path");
const promised  = require("chai-as-promised");
const sinon     = require("sinon");
const root      = path.join(__dirname, "../../../");
const sequelize = require(path.join(root, "src/main/connection"));
const expect    = chai.expect;

const ProjectModel      = sequelize.models.Project;
const ProjectController = require(path.join(root, "src/main/controllers/projects"));
const NotFoundResource  = require(path.join(root, "src/main/errors/NotFoundResource"));
const InvalidBodyError  = require(path.join(root, "src/main/errors/InvalidBodyError"));

chai.use(promised);

describe("Project controller test", () => {
	let sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it("should get a list of projects", () => {
		sandbox.stub(ProjectModel, "findAll").resolves([1, 2, 3]);

		return expect(ProjectController.getAll()).to.be.eventually.fulfilled
			.and.be.instanceOf(Array);
	});

	it("should get an project by id", () => {
		sandbox.stub(ProjectModel, "findById").resolves(new ProjectModel());

		return expect(ProjectController.getById(2)).to.be.eventually.fulfilled
			.and.be.instanceOf(ProjectModel);
	});

	it("should successfully update an project", () => {
		sandbox.stub(ProjectController, "getById").resolves(new ProjectModel());
		sandbox.stub(ProjectModel.prototype, "update").resolves();

		return expect(ProjectController.update(3, {})).to.be.eventually.fulfilled;
	});

	it("should successfully create a new project", () => {
		sandbox.stub(ProjectModel, "create").resolves(new ProjectModel());

		const data = {
			name: "projectTest",
			private: false
		};

		return expect(ProjectController.create(data)).to.be.eventually.fulfilled;
	});

	it("should successfully delete an project", () => {
		sandbox.stub(ProjectModel.prototype, "destroy").resolves();
		sandbox.stub(ProjectController, "getById").resolves(new ProjectModel());

		return expect(ProjectController.deleteById(3)).to.eventually.be.fulfilled;
	});


	it("should throw \"NotFoundResource\" when project is not found by id", () => {
		sandbox.stub(ProjectModel, "findById").resolves(null);

		return expect(ProjectController.getById(3)).to.eventually.be.rejectedWith(NotFoundResource);
	});

	it("should throw \"InvalidBodyError\" when updating an project with unknown fields", () => {
		sandbox.stub(ProjectController, "getById").resolves();
		sandbox.stub(ProjectModel.prototype, "update").rejects(new Error());

		return expect(ProjectController.update(2, {})).to.eventually.be.rejectedWith(InvalidBodyError);
	});

	it("should throw \"NotFoundResource\" when project id is not found on updating", () => {
		sandbox.stub(ProjectController, "getById").rejects(new NotFoundResource());

		return expect(ProjectController.update(2, {})).to.eventually.be.rejectedWith(NotFoundResource);
	});
});