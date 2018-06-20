const {Model, DataTypes} = require("sequelize");

let models = {};

const attributes = {
	id: {
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	tasks_id: {
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: true
	},
	users_id: {
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: true
	}
};

const tableOptions = {
	tableName: "tasks_assignee",
	createdAt: "create_time",
	updatedAt: "update_time",
	deletedAt: "delete_time",
	paranoid: true
};

module.exports = class TaskAssignee extends Model {
	/**
	 * Defines a model class into sequelize instance
	 *
	 * @param {Sequelize} sequelize The sequelize instance
	 */
	static init(sequelize) {
		super.init(attributes, Object.assign({}, {sequelize}, tableOptions));

		models = sequelize.models;
	}

	/**
	 * Defines the model associations in the database
	 */
	static associate() {
		this.belongsTo(models.Task, {
			targetKey: "id",
			foreignKey: "tasks_id"
		});

		this.belongsTo(models.User, {
			targetKey: "id",
			foreignKey: "users_id"
		});
	}
};