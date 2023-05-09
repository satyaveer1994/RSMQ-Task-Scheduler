## Node.js RSMQ Example

This is a simple Node.js application that demonstrates how to use Redis Simple Message Queue (RSMQ) to schedule and execute tasks asynchronously in a Node.js application.
Installation

To install the application, clone the repository from GitHub:

bash

git clone https://github.com/satyaveer1994/RSMQ-Task-Scheduler.git
cd node-rsmq-example

Then, install the required dependencies using npm:

bash

npm install

Configuration

Before you can use the application, you need to configure it by creating a .env file in the project root directory. The file should contain the following environment variables:

makefile

MONGODB_URI=mongodb://localhost:27017/tasks
REDIS_HOST=localhost
REDIS_PORT=6379

    MONGODB_URI: The URI of the MongoDB instance where the application will store task details.
    REDIS_HOST: The hostname or IP address of the Redis server where the application will store the message queue.
    REDIS_PORT: The port number of the Redis server.

Usage

To start the application, run the following command:

bash

npm nodemon src/app.js

This will start the application on port 3000 by default. You can then access the application by opening a web browser and navigating to http://localhost:3000.

The application exposes a REST API that allows you to create new tasks and get a list of all tasks. When you create a new task, the application adds it to the message queue, which is then consumed by a separate worker process that executes the task asynchronously.
API
# Create Task

bash

POST /tasks

Create a new task with the specified name, description, and execution time.
Request Body

json

{
  "name": "Task Name",
  "description": "Task Description",
  "executeAt": "2023-06-01T00:00:00.000Z"
}

Response Body

json

{
  "id": "609b1699e75d86001541418d",
  "name": "Task Name",
  "description": "Task Description",
  "status": "OPEN",
  "executeAt": "2023-06-01T00:00:00.000Z"
}



License

This application is licensed under the MIT License. See the LICENSE file for more information.