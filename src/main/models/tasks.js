const {Model, DataTypes} = require("sequelize");

let models = {};

const attributes = {
	id: {
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	name: {
		type: DataTypes.STRING(45),
		allowNull: false
	},
	description: {
		type: DataTypes.TEXT,
		allowNull: true
	},
	status: {
		type: DataTypes.TINYINT(1),
		allowNull: true
	},
	projects_id: {
		type: DataTypes.INTEGER(11),
		allowNull: false
	}
};

const tableOptions = {
	tableName: "tasks",
	createdAt: "create_time",
	updatedAt: "update_time",
	deletedAt: "delete_time",
	paranoid: true
};

module.exports = class Task extends Model {
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
		this.belongsTo(models.Project, {
			targetKey: "id",
			foreignKey: "projects_id"
		});

		this.hasMany(models.TaskAssignee, {
			sourceKey: "id",
			foreignKey: "tasks_id"
		});

		this.hasMany(models.TaskComment, {
			sourceKey: "id",
			foreignKey: "tasks_id"
		});
	}
};