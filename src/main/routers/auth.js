const express = require("express");
const Helper  = require("./../../../utils/helper");
const Router  = express.Router();

const usersController = Helper.loadController("users");
const JSONWebToken = Helper._loadCode("JSONWebToken", "classes");

Router.post("/register", (request, response, next) => {
	usersController.create(request.body)
		.then(user => {
			response.status(201);
			response.json(user);
		}).catch(error => next(error));
});

Router.post("/create", (request, response, next) => {
	usersController.login(request.body.email, request.body.password)
		.then(user => JSONWebToken.encode({id: user.id}, "15m"))
		.then(token => response.json({token}))
		.catch(error => next(error));
});

Router.get("/resolve", (request, response, next) => {
	JSONWebToken.decodeFromAuthorization(request.get("Authorization"))
		.then(session => usersController.getById(session.id))
		.then(user => response.json(user))
		.catch(error => next(error));
});

module.exports = Router;