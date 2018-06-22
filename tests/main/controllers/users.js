const chai      = require("chai");
const path      = require("path");
const promised  = require("chai-as-promised");
const sinon     = require("sinon");
const root      = path.join(__dirname, "../../../");
const sequelize = require(path.join(root, "src/main/connection"));
const expect    = chai.expect;

const UserModel         = sequelize.models.User;
const UserController    = require(path.join(root, "src/main/controllers/users"));
const NotFoundResource  = require(path.join(root, "src/main/errors/NotFoundResource"));
const InvalidLoginError = require(path.join(root, "src/main/errors/InvalidLoginError"));
const InvalidBodyError  = require(path.join(root, "src/main/errors/InvalidBodyError"));

chai.use(promised);

describe("User controller test", () => {
	let sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it("should get a list of users", () => {
		sandbox.stub(UserModel, "findAll").resolves([1, 2, 3]);

		return expect(UserController.getAll()).to.be.eventually.fulfilled
			.and.be.instanceOf(Array);
	});

	it("should get an user by id", () => {
		sandbox.stub(UserModel, "findById").resolves(new UserModel());

		return expect(UserController.getById(2)).to.be.eventually.fulfilled
			.and.be.instanceOf(UserModel);
	});

	it("should get an user by email", () => {
		sandbox.stub(UserModel, "findOne").resolves(new UserModel());

		return expect(UserController.getByEmail("random@test.com")).to.be.eventually.fulfilled
			.and.be.instanceOf(UserModel);
	});

	it("should get an user by email with selected fields", () => {
		sandbox.stub(UserModel, "findOne").resolves({});

		const args = ["random@test.com", ["email", "password"]];
		const expectedArg = {
			where: {email: "random@test.com"},
			attributes: ["email", "password"]
		};

		return expect(UserController.getByEmail(...args)).to.be.eventually.fulfilled
			.then(() => {
				const call = UserModel.findOne.getCall(0);
				const arg = call.args[0];

				return expect(arg).to.eql(expectedArg);
			});
	});

	it("should get an user with provided field name and value", () => {
		sandbox.stub(UserModel, "findOne").resolves(new UserModel());

		return expect(UserController.getByField("username", "userTest")).to.be.eventually.fulfilled
			.then(() => {
				const expectedArg = {
					where: {username: "userTest"}
				};

				return expect(UserModel.findOne.calledWith(expectedArg)).to.be.true;
			});
	});

	it("should successfully update an user", () => {
		sandbox.stub(UserController, "getById").resolves(new UserModel());
		sandbox.stub(UserModel.prototype, "update").resolves();

		return expect(UserController.update(3, {})).to.be.eventually.fulfilled;
	});

	it("should successfully create a new user", () => {
		sandbox.stub(UserModel, "create").resolves(new UserModel());
		sandbox.stub(UserController, "getByField").rejects(new NotFoundResource());

		const data = {
			username: "userTest",
			password: "passwordTest"
		};

		return expect(UserController.create(data)).to.be.eventually.fulfilled;
	});

	it("should successfully delete an user", () => {
		sandbox.stub(UserModel.prototype, "destroy").resolves();
		sandbox.stub(UserController, "getById").resolves(new UserModel());

		return expect(UserController.deleteById(3)).to.eventually.be.fulfilled;
	});

	it("should successfully login", () => {
		const mockedUser = new UserModel({
			password: "12132152"
		});

		const login = {
			email: "random@test.com",
			password: "12132152"
		};

		return UserModel._hashPassword(mockedUser)
			.then(() => {
				sandbox.stub(UserController, "getByEmail").resolves(mockedUser);

				return expect(UserController.login(login.email, login.password)).to.be.eventually.fulfilled;
			});
	});

	it("should throw \"NotFoundResource\" when user is not found by id", () => {
		sandbox.stub(UserModel, "findById").resolves(null);

		return expect(UserController.getById(3)).to.eventually.be.rejectedWith(NotFoundResource);
	});

	it("should throw \"NotFoundResource\" when user is not found by email", () => {
		sandbox.stub(UserModel, "findOne").resolves(null);

		return expect(UserController.getByEmail("testasdm@fnj.com")).to.eventually.be.rejectedWith(NotFoundResource);
	});

	it("should throw \"NotFoundResource\" when user is not found by field and value", () => {
		sandbox.stub(UserModel, "findOne").resolves(null);

		return expect(UserController.getByField("id", 4)).to.eventually.be.rejectedWith(NotFoundResource);
	});

	it("should throw \"InvalidBodyError\" when creating an user with an existent username", () => {
		sandbox.stub(UserController, "getByField").resolves();

		return expect(UserController.create({})).to.eventually.be.rejectedWith(InvalidBodyError);
	});

	it("should throw the unexpected caught error when creating an user", () => {
		sandbox.stub(UserController, "getByField").rejects(new Error());

		return expect(UserController.create({})).to.eventually.be.rejectedWith(Error);
	});

	it("should throw \"InvalidBodyError\" when updating an user with unknown fields", () => {
		sandbox.stub(UserController, "getById").resolves();
		sandbox.stub(UserModel.prototype, "update").rejects(new Error());

		return expect(UserController.update(2, {})).to.eventually.be.rejectedWith(InvalidBodyError);
	});

	it("should throw \"NotFoundResource\" when user id is not found on updating", () => {
		sandbox.stub(UserController, "getById").rejects(new NotFoundResource());

		return expect(UserController.update(2, {})).to.eventually.be.rejectedWith(NotFoundResource);
	});

	it("should throw \"InvalidLoginError\" when login an user with invalid email", function () {
		sandbox.stub(UserController, "getByEmail").rejects();

		return expect(UserController.login("", "")).to.eventually.be.rejectedWith(InvalidLoginError);
	});

	it("should throw \"InvalidLoginError\" when login an user with invalid password", function () {
		sandbox.stub(UserController, "getByEmail").resolves(new UserModel());

		const password = "12121";

		return expect(UserController.login("", password)).to.eventually.be.rejectedWith(InvalidLoginError);
	});

});