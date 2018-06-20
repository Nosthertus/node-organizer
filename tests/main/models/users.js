const chai      = require("chai");
const path      = require("path");
const promised  = require("chai-as-promised");
const sinon     = require("sinon");
const root      = path.join(__dirname, "../../../");
const sequelize = require(path.join(root, "src/main/connection"));
const User      = sequelize.models.User;
const expect    = chai.expect;

chai.use(promised);

describe("User model test", () => {
	let _data = {
		username: "asdjnd",
		firstName: "asdf",
		lastName: "asdf",
		password: "kljsdfioqsahjk213ad",
		birthday: "1993-04-12",
		email: "test@random.com"
	};
	let data;
	let sandbox;

	beforeEach(() => {
		data = Object.assign({}, _data);
		sandbox = sinon.createSandbox();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it("should invalidate if username length is not in between 3 and 45", function(){
		data.username = "";

		let user = new User(data);

		return expect(user.validate()).to.eventually.be.rejected
			.and.have.property("errors")
			.and.have.lengthOf(1)
			.and.have.nested.property("[0].path", "username");
	});

	it("should invalidate if birthday value is not a valid format", function() {
		data.birthday = 12312312;

		let user = new User(data);

		return expect(user.validate()).to.be.eventually.rejected
			.and.have.property("errors")
			.and.have.lengthOf(1)
			.and.have.nested.property("[0].path", "birthday");
	});

	it("should invalidate if email is not valid", function(){
		data.email = "asdkgj";

		let user = new User(data);

		return expect(user.validate()).to.eventually.be.rejected
			.and.have.property("errors")
			.and.have.lengthOf(1)
			.and.have.nested.property("[0].path", "email");
	});

	it("should hash password", function() {
		let user = new User(data);

		return expect(User._hashPassword(user)).to.be.eventually.fulfilled
			.then(() => {
				expect(user.password).not.be.equal(data.password);
			});
	});

	it("should not hash password when not changed", function() {
		sandbox.stub(User.prototype, "changed").returns(false);

		let user = new User(data);

		return expect(User._hashPassword(user)).to.be.undefined;
	});
});