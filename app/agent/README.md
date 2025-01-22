# AI Agent

The AI agent is a Node.js server that uses Gemini to generate text embeddings. The server listens for requests from the client server and gets the skill to use from the request. The server then sends the request to the agent to process and returns the response to the client server.

## Ideation

Node.js server (text-embedding-004 and 1.5 Flash) that handles different types of requests from the client. Responses are cached in a Redis database to reduce the number of requests to the agent. The client server can access the Redis database to get the response to a request if it exists to reduce the number of requests to the agent.

## Execution

```bash

docker compose up --build

```

## Cleanup

```bash

# Stop all running containers
docker stop $(docker ps -aq)

# Remove all containers
docker rm $(docker ps -aq)

# Remove all images
docker rmi $(docker images -q)

# Remove all volumes
docker volume rm $(docker volume ls -q)

# Remove all networks
docker network rm $(docker network ls -q)  

```
