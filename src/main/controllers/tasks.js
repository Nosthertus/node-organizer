const sequelize = require("./../connection");
const Task      = sequelize.models.Task;

const NotFoundResource = require("./../errors/NotFoundResource");
const InvalidBodyError = require("./../errors/InvalidBodyError");

class taskController {
	/**
	 * The list of fields that can be aplied for a criteria search
	 *
	 * @return {string[]}
	 */
	static get filters() {
		return ["projects_id"];
	}

	/**
	 * Gets a list of tasks
	 *
	 * @param  {Object}                filters The criteria filter to apply in the search
	 * @return {Promise<Array<Model>>}         The result with a list of task instances
	 */
	static getAll(filters) {
		let criteria = {};

		if (filters) {
			Object.keys(filters).forEach(filter => {
				if (this.filters.includes(filter)) {
					criteria[filter] = filters[filter];
				}
			});
		}

		return Task.findAll({ where: criteria });
	}

	/**
	 * Gets an task by the provided id
	 *
	 * @param  {Integer}          id The id of the task
	 * @throws {NotFoundResource} If No task was found
	 * @return {Promise<Model>}      The result with the task instance
	 */
	static getById(id) {
		return Task.findById(id)
			.then(task => {
				if (task == null) {
					throw new NotFoundResource("Task is not found");
				}

				else {
					return task;
				}
			});
	}

	/**
	 * Finds and updates the fields of the task
	 *
	 * @param  {Integer}          id   The id of the task
	 * @param  {Object}           body The values to update in the task
	 * @throws {NotFoundResource} If   No task was found
	 * @throws {InvalidBodyError} If   Invalid field/value is passed in the update
	 * @throws {Error}            If   Un-handled error occurs
	 * @return {Promise<this>}         The result of the update with the changed task instance
	 */
	static update(id, body) {
		return this.getById(id)
			.then(task => task.update(body))
			.catch(error => {
				if (error.name && error.name !== "NotFoundResource") {
					throw new InvalidBodyError("Error in field of task");
				}

				else {
					throw error;
				}
			});
	}

	/**
	 * Creates a new task and stores it to the database.
	 *
	 * @param  {Object}         body The body object that contains the new task data
	 * @return {Promise<Model>}      The result of creating a new task with its instance
	 */
	static create(body) {
		return Task.create(body);
	}

	/**
	 * Deletes the task
	 * This should only add a timestamp value in delete_time field
	 *
	 * @param  {Number}  id The id of the task
	 * @return {Promise}    The result of deleting a task
	 */
	static deleteById(id) {
		return this.getById(id)
			.then(task => task.destroy());
	}
}

module.exports = taskController;