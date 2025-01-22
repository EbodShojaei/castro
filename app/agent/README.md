# AI Agent

The AI agent is a Node.js server that uses Gemini to generate text embeddings. The server listens for requests from the client server and gets the skill to use from the request. The server then sends the request to the agent to process and returns the response to the client server.

## Ideation

Node.js server (text-embedding-004 and 1.5 Flash) that handles different types of requests from the client. Responses are cached in a Redis database to reduce the number of requests to the agent. The client server can access the Redis database to get the response to a request if it exists to reduce the number of requests to the agent.

## Execution

```bash

docker compose up --build

```
