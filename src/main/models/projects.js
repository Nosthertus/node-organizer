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
	private: {
		type: DataTypes.BOOLEAN,
		allowNull: true
	},
	status: {
		type: DataTypes.TINYINT(1),
		allowNull: true
	},
	users_id: {
		type: DataTypes.INTEGER(11),
		allowNull: false
	},
	types_id: {
		type: DataTypes.INTEGER(11),
		allowNull: false
	}

};

const tableOptions = {
	tableName: "users",
	createdAt: "create_time",
	updatedAt: "update_time",
	deletedAt: "delete_time",
	paranoid: true
};

module.exports = class Project extends Model {
	/**
	 * Defines a model class into sequelize instance
	 *
	 * @param {Sequelize} sequelize The sequelize instance
	 */
	static init(sequelize) {
		super.init(attributes, Object.assign({}, {sequelize}, tableOptions));

		models = sequelize.models;
	}
};