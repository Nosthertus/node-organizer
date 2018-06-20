const {Model, DataTypes} = require("sequelize");

let models = {};

const attributes = {
	id: {
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	username: {
		type: DataTypes.STRING(45),
		allowNull: false,
		validate: {
			len: {
				args: [3,45],
				msg: "String length is not in this range"
			}
		}
	},
	firstName: {
		type: DataTypes.STRING(20),
		allowNull: false,
		field: "first_name"
	},
	lastName: {
		type: DataTypes.STRING(20),
		allowNull: false,
		field: "last_name"
	},
	birthday: {
		type: DataTypes.DATEONLY,
		allowNull: true,
		validate: {
			isValidDate(value) {
				if(value === "1969-12-31" || value === "1970-01-01") {
					throw new Error("Provided date does not match with validated formats");
				}
			}
		}
	},
	password: {
		type: DataTypes.STRING(100),
		allowNull: false
	},
	email: {
		type: DataTypes.STRING(100),
		allowNull: false,
		validate: {
			isEmail: {
				msg: "Type of field should be an email."
			}
		}
	}
};

const tableOptions = {
	tableName: "users",
	createdAt: "create_time",
	updatedAt: "update_time",
	deletedAt: "delete_time",
	paranoid: true
};

module.exports = class User extends Model {
	static init(sequelize) {
		super.init(attributes, Object.assign({}, {sequelize}, tableOptions));

		models = sequelize.models;
	}

	/**
	 * Defines the model associations in the database
	 */
	static associate() {
		this.hasMany(models.TaskAssignee, {
			sourceKey: "id",
			foreignKey: "users_id"
		});

		this.hasMany(models.Project, {
			sourceKey: "id",
			foreignKey: "users_id"
		});

		this.hasMany(models.TaskComment, {
			sourceKey: "id",
			foreignKey: "users_id"
		});
	}
};