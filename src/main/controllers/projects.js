const sequelize = require("./../connection");
const Project      = sequelize.models.Project;

const NotFoundResource = require("./../errors/NotFoundResource");
const InvalidBodyError = require("./../errors/InvalidBodyError");

class projectController {
	/**
	 * Gets a list of Projects
	 *
	 * @returns {Promise<Array<Model>>} The result with a list of project instances
	 */
	static getAll() {
		return Project.findAll();
	}

	/**
	 * Gets an project by the provided id
	 *
	 * @param  {Integer}          id The id of the project
	 * @throws {NotFoundResource} If No project was found
	 * @return {Promise<Model>}      The result with the project instance
	 */
	static getById(id) {
		return Project.findById(id)
			.then(project => {
				if (project == null) {
					throw new NotFoundResource("Project is not found");
				}

				else {
					return project;
				}
			});
	}

	/**
	 * Finds and updates the fields of the project
	 *
	 * @param  {Integer}          id   The id of the project
	 * @param  {Object}           body The values to update in the project
	 * @throws {NotFoundResource} If   No project was found
	 * @throws {InvalidBodyError} If   Invalid field/value is passed in the update
	 * @throws {Error}            If   Un-handled error occurs
	 * @return {Promise<this>}         The result of the update with the changed project instance
	 */
	static update(id, body) {
		return this.getById(id)
			.then(project => project.update(body))
			.catch(error => {
				if (error.name && error.name !== "NotFoundResource") {
					throw new InvalidBodyError("Error in field of project");
				}

				else {
					throw error;
				}
			});
	}

	/**
	 * Creates a new project and stores it to the database.
	 *
	 * @param  {Object}         body The body object that contains the new project data
	 * @return {Promise<Model>}      The result of creating a new project with its instance
	 */
	static create(body) {
		return Project.create(body);
	}

	/**
	 * Deletes the project
	 * This should only add a timestamp value in delete_time field
	 *
	 * @param  {Number}  id The id of the project
	 * @return {Promise}    The result of deleting a project
	 */
	static deleteById(id) {
		return this.getById(id)
			.then(project => project.destroy());
	}
}

module.exports = projectController;