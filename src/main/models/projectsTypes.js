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
	summary: {
		type: DataTypes.INTEGER(5),
		allowNull: true
	},

};

const tableOptions = {
	tableName: "projects_types",
	createdAt: "create_time",
	updatedAt: "update_time",
	deletedAt: "delete_time",
	paranoid: true
};

module.exports = class ProjectType extends Model {
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
		this.hasMany(models.Project, {
			sourceKey: "id",
			foreignKey: "types_id"
		});
	}
};