const express = require("express");
const Helper  = require("./../../../utils/helper");
const Router  = express.Router();

const tasksController = Helper.loadController("tasks");

Router.param("id", (request, response, next, id) => {
	tasksController.getById(id, "detail")
		.then(data => {
			request.task = data;
			next();
		}).catch(error => {
		next(error);
	});
});

Router.route("/")
	.post((request, response, next) => {
		tasksController.create(request.body, request.query.filter)
			.then(task => {
				response.status(201);
				response.json(task);
			}).catch(error => {
			next(error);
		});
	})
	.get((request, response, next) => {
		tasksController.getAll(request.query.search)
			.then(data => {
				response.json(data);
			}).catch(error => {
			next(error);
		});
	});

Router.route("/:id")
	.get((request, response) => {
		response.json(request.task);
	})
	.delete((request, response, next) => {
		tasksController.deleteById(request.task.id)
			.then(() => {
				response.json();
			}).catch(error => {
			next(error);
		});
	})
	.patch((request, response, next) => {
		tasksController.update(request.task.id, request.body)
			.then(data => {
				response.json(data);
			}).catch(error => {
			next(error);
		});
	});


module.exports = Router;