const express    = require("express");
const bodyParser = require("body-parser");
const cors       = require("cors");
const Helper     = require("./utils/helper");

const usersRouter = Helper.loadRoute("users");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", usersRouter);

app.use(errorHandler);

function errorHandler(error, request, response, next){
	switch(error.name){
		case "InvalidLoginError":
			response.status(401);
			response.json(error.toJSON());
			break;

		case "InvalidBodyError":
			response.status(409);
			response.json(error.toJSON());
			break;

		case "NotFoundResource":
			response.status(404);
			response.json(error.toJSON());
			break;

		case "InvalidObjectError":
			response.status(500);
			response.end();
			break;

		case "UnauthorizedError":
			response.status(401);
			response.json(error.toJSON());
			break;

		default:
			if(process.env.NODE_ENV !== "test") {
				console.log(error);
			}

			response.status(500);
			response.end();
	}

	next();
}

module.exports = app;