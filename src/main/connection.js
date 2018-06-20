const Sequelize = require("sequelize");
const path      = require("path");
const fs        = require("fs");
const _         = require("underscore");
const env       = process.env.NODE_ENV || "development";
const root      = path.join(__dirname, "../../");
const config    = require(path.join(root, "config.json"))[env].database;
const modelPath = path.join(root, "src/main/models");

const sequelize = new Sequelize(config);

/*
 * Load all models
 */
fs.readdirSync(modelPath)
	.filter((file) => {
		if (!file.startsWith(".")) {
			return path.extname(file) === ".js";
		}

		return false;
	}).forEach(file => {
		const model = require(path.join(modelPath, file));

		model.init(sequelize);
	});

Object.keys(sequelize.models)
	.forEach(modelName => {
		let model = sequelize.models[modelName];

		if (_.has(model, "associate")) {
			model.associate(sequelize.models);
		}
	});

module.exports = sequelize;