const sequelize = require("sequelize");
const Model     = sequelize.Model;
const DataTypes = sequelize.DataTypes;

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
	tableName: "projects",
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

	/**
	 * Injects scopes into the Model
	 * @NOTE: This should be loaded after all models have been loaded into the sequelize instance
	 * @private
	 */
	static _loadScopes() {
		const scopes = {
			withType: {
				include: [{
					model: models.ProjectType,
					attributes: []
				}],
				attributes: {
					include: [[sequelize.col("ProjectType.name"), "type"]],
					exclude: ["types_id"]
				}
			}
		};

		for (let scopeName in scopes) {
			let scope = scopes[scopeName];

			this.addScope(scopeName, scope);
		}
	}

	/**
	 * Defines the model associations in the database
	 */
	static associate() {
		this.hasMany(models.Task, {
			sourceKey: "id",
			foreignKey: "projects_id"
		});

		this.belongsTo(models.User, {
			targetKey: "id",
			foreignKey: "users_id"
		});

		this.belongsTo(models.ProjectType, {
			targetKey: "id",
			foreignKey: "types_id"
		});
	}
};