const chai      = require("chai");
const path      = require("path");
const promised  = require("chai-as-promised");
const sinon     = require("sinon");
const root      = path.join(__dirname, "../../../");
const sequelize = require(path.join(root, "src/main/connection"));
const expect    = chai.expect;

const TaskModel      = sequelize.models.Task;
const TaskController = require(path.join(root, "src/main/controllers/tasks"));
const NotFoundResource  = require(path.join(root, "src/main/errors/NotFoundResource"));
const InvalidBodyError  = require(path.join(root, "src/main/errors/InvalidBodyError"));

chai.use(promised);

describe("Task controller test", () => {
	let sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it("should get a list of tasks", () => {
		sandbox.stub(TaskModel, "findAll").resolves([1, 2, 3]);

		return expect(TaskController.getAll()).to.be.eventually.fulfilled
			.and.be.instanceOf(Array);
	});

	it("should get a task by id", () => {
		sandbox.stub(TaskModel, "findById").resolves(new TaskModel());

		return expect(TaskController.getById(2)).to.be.eventually.fulfilled
			.and.be.instanceOf(TaskModel);
	});

	it("should successfully update a task", () => {
		sandbox.stub(TaskController, "getById").resolves(new TaskModel());
		sandbox.stub(TaskModel.prototype, "update").resolves();

		return expect(TaskController.update(3, {})).to.be.eventually.fulfilled;
	});

	it("should successfully create a new task", () => {
		sandbox.stub(TaskModel, "create").resolves(new TaskModel());

		const data = {
			name: "taskTest",
			projects_id: 2
		};

		return expect(TaskController.create(data)).to.be.eventually.fulfilled;
	});

	it("should successfully delete a task", () => {
		sandbox.stub(TaskModel.prototype, "destroy").resolves();
		sandbox.stub(TaskController, "getById").resolves(new TaskModel());

		return expect(TaskController.deleteById(3)).to.eventually.be.fulfilled;
	});


	it("should throw \"NotFoundResource\" when task is not found by id", () => {
		sandbox.stub(TaskModel, "findById").resolves(null);

		return expect(TaskController.getById(3)).to.eventually.be.rejectedWith(NotFoundResource);
	});

	it("should throw \"InvalidBodyError\" when updating a task with unknown fields", () => {
		sandbox.stub(TaskController, "getById").resolves();
		sandbox.stub(TaskModel.prototype, "update").rejects(new Error());

		return expect(TaskController.update(2, {})).to.eventually.be.rejectedWith(InvalidBodyError);
	});

	it("should throw \"NotFoundResource\" when task id is not found on updating", () => {
		sandbox.stub(TaskController, "getById").rejects(new NotFoundResource());

		return expect(TaskController.update(2, {})).to.eventually.be.rejectedWith(NotFoundResource);
	});
});