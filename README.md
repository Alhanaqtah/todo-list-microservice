# Todo List Microservice

The **Todo List Microservice** is responsible for managing projects, columns and tasks. It provides CRUD functionality for these entities and integrates user authentication and authorization through the [**Auth Microservice**](https://github.com/Alhanaqtah/todo-list-auth-microservice). This service communicates with the Auth service via RabbitMQ.

## Features

- CRUD operations for projects, columns, and tasks
- User-based access control through integration with the **Auth Microservice**
- Asynchronous communication with **Auth Microservice** using RabbitMQ
- Role-based access control for managing project permissions

## Installation

1. Clone the repository
```bash
git clone https://github.com/Alhanaqtah/todo-list-microservice.git
cd todo-list-microservice
```

2. Install dependencies
```bash
npm install
```

3. Environment Configuration
Create a .env file in the root directory and configure environment variables like in .example.env.

## Running the service
- With Docker
If you prefer to run the service with Docker, simply build and run the Docker container:
```bash
docker build -t todo-list-microservice .
docker run -p 3000:3000 --env-file .env todo-list-microservice
```
- Without Docker
To run the service locally without Docker, use the following command:
```bash
npm run start:dev
```
