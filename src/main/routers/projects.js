const express = require("express");
const Helper  = require("./../../../utils/helper");
const Router  = express.Router();

const projectsController = Helper.loadController("projects");

Router.param("id", (request, response, next, id) => {
	projectsController.getById(id, "detail")
		.then(data => {
			request.project = data;
			next();
		}).catch(error => {
			next(error);
		});
});

Router.route("/")
	.post((request, response, next) => {
		projectsController.create(request.body)
			.then(project => {
				response.status(201);
				response.json(project);
			}).catch(error => {
				next(error);
			});
	})
	.get((request, response, next) => {
		projectsController.getAll(request.query.search)
			.then(data => {
				response.json(data);
			}).catch(error => {
				next(error);
			});
	});

Router.route("/:id")
	.get((request, response) => {
		response.json(request.project);
	})
	.delete((request, response, next) => {
		projectsController.deleteById(request.project.id)
			.then(() => {
				response.json();
			}).catch(error => {
				next(error);
			});
	})
	.patch((request, response, next) => {
		projectsController.update(request.project.id, request.body)
			.then(data => {
				response.json(data);
			}).catch(error => {
				next(error);
			});
	});


module.exports = Router;