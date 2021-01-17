const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid} = require('uuid');
const e = require("cors");
const { json } = require("express");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const findRepositoryIndex = (id) => repositories.findIndex(repository=>repository.id === id)

const validateRepositoryId = (request, response, next) =>{
	if (!isUuid(request.params.id)){
		return response.status(400).json({error:"Invalid repository id"})
	}
  return next()
}

app.get("/repositories", (request, response) => {
  response.json(repositories)
});

app.post("/repositories", (request, response) => {
	const { title, url, techs} = request.body
	const repository = {id: uuid(), title, url, techs, likes: 0}
	repositories.push(repository)
	response.json(repository)
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
	const id = request.params.id
	const repositoryIndex = findRepositoryIndex(id)

	if (repositoryIndex < 0){
		response.status(400).json({error: "repository does not exist"})
		return
	}

	const {likes} = repositories[repositoryIndex]
	repositories[repositoryIndex] = {...request.body, id, likes}
	response.json(repositories[repositoryIndex])
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
	const id = request.params.id
	const repositoryIndex = findRepositoryIndex(id)

	if (repositoryIndex < 0){
		response.status(400).json({error: "repository does not exist"})
		return
	}

	repositories.splice(repositoryIndex, 1)
	response.status(204).send()
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
	const id = request.params.id
	const repositoryIndex = findRepositoryIndex(id)
	
	if (repositoryIndex < 0){
		response.status(400).json({error: "repository does not exist"})
	}

	const repository = repositories[repositoryIndex]
	repository.likes++

	response.json(repository)
	return
});

module.exports = app;
