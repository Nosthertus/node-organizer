const bcrypt    = require("bcrypt");
const sequelize = require("./../connection");
const User      = sequelize.models.User;

const NotFoundResource = require("./../errors/NotFoundResource");
const InvalidLoginError = require("./../errors/InvalidLoginError");
const InvalidBodyError = require("./../errors/InvalidBodyError");

class UserController {
	/**
	 * Gets a list of Users
	 *
	 * @returns {Promise<Array<Model>>} The result with a list of user instances
	 */
	static getAll() {
		return User.findAll();
	}

	/**
	 * Gets an user by the provided id
	 *
	 * @param  {Integer}          id The id of the user
	 * @throws {NotFoundResource} If No user was found
	 * @return {Promise<Model>}      The result with the user instance
	 */
	static getById(id) {
		return User.findById(id)
			.then(user => {
				if (user == null) {
					throw new NotFoundResource("User is not found");
				}

				else {
					return user;
				}
			});
	}

	/**
	 * Gets an user by the provided email
	 *
	 * @param  {String}           email The email of the user
	 * @throws {NotFoundResource} If    No user was found
	 * @return {Promise<Model>}         The result with the user instance
	 */
	static getByEmail(email) {
		const criteria = {
			email: email
		};

		return User.findOne({where: criteria})
			.then(user => {
				if (user == null) {
					throw new NotFoundResource("User is not found");
				}

				else {
					return user;
				}
			});
	}

	/**
	 * Gets an user with the name of the provided field that contains the provided value
	 * @param  {String}           field The name of the field in the model
	 * @param  {*}                value The value which contains the field
	 * @throws {NotFoundResource} If    When no user is found with the requested criteria
	 * @return {Promise<Model>}         The result with the user instance
	 */
	static getByField(field, value) {
		const criteria = {
			[field]: value
		};

		return User.findOne({where: criteria})
			.then(user => {
				if (user == null) {
					throw new NotFoundResource("User is not found");
				}

				else {
					return user;
				}
			});
	}

	/**
	 * Finds and updates the fields of the user
	 *
	 * @param  {Integer}          id   The id of the user
	 * @param  {Object}           body The values to update in the user
	 * @throws {NotFoundResource} If   No user was found
	 * @throws {InvalidBodyError} If   Invalid field/value is passed in the update
	 * @throws {Error}            If   Un-handled error occurs
	 * @return {Promise<this>}         The result of the update with the changed user instance
	 */
	static update(id, body) {
		return this.getById(id)
			.then(user => user.update(body))
			.catch(error => {
				if (error.name && error.name !== "NotFoundResource") {
					throw new InvalidBodyError("Error in field of user");
				}

				else {
					throw error;
				}
			});
	}

	/**
	 * Creates a new user and stores it to the database.
	 * It first calls getByField to check if username is already taken.
	 *
	 * @param  {Object}           body The body object that contains the new user data
	 * @throws {InvalidBodyError} If   The user already exists
	 * @throws {*}                If   Unexpected error occurs
	 * @return {Promise<Model>}        The result of creating a new user with its instance
	 */
	static create(body) {
		return this.getByField("username", body.username)
			.then(() => {
				throw new InvalidBodyError("Username is already on use", [{
					field: "username",
					message: "User already exists"
				}]);
			}).catch(error => {
				if (error.name !== "NotFoundResource") {
					throw error;
				}

				else {
					return User.create(body);
				}
			});
	}

	/**
	 * Deletes the user
	 * This should only add a timestamp value in delete_time field
	 *
	 * @param  {Number}  id The id of the user
	 * @return {Promise}    The result of deleting an user
	 */

	static deleteById(id) {
		return this.getById(id)
			.then(user => user.destroy());
	}

	/**
	 * Verifies if the login credentials are ok
	 *
	 * @param  {String}            email    The email of the user
	 * @param  {String}            password The password of the user
	 * @throws {InvalidLoginError} If       User email or password are not correct
	 * @return {Promise}                    The result of credentials verification
	 */
	static login(email, password) {
		let _user;

		return this.getByEmail(email)
			.then(user => {
				_user = user;

				return bcrypt.compare(password, user.password);
			}).then(() => {
				return _user.toJSON();
			}).catch(() => {
				throw new InvalidLoginError("Email or Password is incorrect");
			});
	}
}

module.exports = UserController;