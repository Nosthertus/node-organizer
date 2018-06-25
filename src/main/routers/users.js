const express = require("express");
const Helper  = require("./../../../utils/helper");
const Router  = express.Router();

const usersController = Helper.loadController("users");

Router.param("id", (request, response, next, id) => {
	usersController.getById(id, "detail")
		.then(data => {
			request.user = data;
			next();

		}).catch(error => {
			next(error);
		});
});

Router.route("/")
	.get((request, response, next) => {
		usersController.getAll(request.query.search)
			.then(data => {
				response.json(data);
			}).catch(error => {
				next(error);
			});
	});

Router.route("/:id")
	.get((request, response) => {
		response.json(request.user);
	})
	.patch((request, response, next) => {
		usersController.update(request.body.id, request.body)
			.then(data => {
				response.json(data);
			}).catch(error => {
				next(error);
			});
	});


module.exports = Router;