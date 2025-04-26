## Description

Job Shadow Assessment

This repo is made up of 3 different microservices `api-gateway`, `auth-service` and `user-service`.

The `auth-service` is reponsible for registration and logging in of users.

The `user-service` is responsible for fetching users information.

The `api-gateway` is the entry point.

# Get Started

To get started open 3 terminals for the 3 services and run the following commands

## Installation

```bash
$ npm install
```

For `auth-service`, you can create a `.env` file at the root directory and add the key `JWT_SECRET`.<br>
If not included, a default value is provided for test purposes

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Endpoints

All endpoints are included in this [Postman Collection](https://www.twitch.tv/aceu)

## Multi-Tenancy

This application is **not** connected to any database, so some data are hardcoded.<br>
This means with every, restart (specifically of the `user-service`) all newly created data will be lost.

2 tenants are set up for the purpose of this application. `tenant_1` and `tenant_2`. <br>
Every route is prefixed with either of these 2 tenants i.e `localhost:3000/api/tenant_1/auth/login`.

## API Gateway

The API Gateway leads to 2 other microservices, `auth-service` and `user-service`. <br>
Communication between microservices are made over `TCP`. <br>
`auth-service` consits of registration and loggin in. These routes aren't autheticated. <br>
`user-service` consits of `fetching-all-users` and `fetching-one-user`. These routes are authenticated.

## Authentication

When users register/signin, they are issued with a `JWT token` that is used for authentication. <br>
An authorization header `Bearer ${TOKEN}` is required to access protected routes.

```
hint: The postman collection automatically adds this token to the header afer a successful registration/signin
```

## Authorization

A user can come in 2 roles, `ADMIN` or `USER`. <br>
`ADMIN` users can access the endpoint to fetch all users, futhermore, they can access any user in their tenant.<br>
`USER` users can only view themselves, they cannot view any other user nor access the `fetch-all-users` endpoint

## Logging

For each microservice, a `logs` folder is created at the root directory.<br>
It constains information about every request and response made.<br>
These logs are also shown on the console.

## Rate Limiting

A global rate limiter is implemented accross the application.<br>
For test purposes, all routes can take only `5 requests in 10 seconds`, or `100 requests in 1 minute`.<br>
The `fetch-all-users` endpoints overrides the first limitter. i.e `ADMINS` can request more than 5 times in 10 seconds.

## Non Functional Requirements

- The application is not connected to any database, just to make it lightweight and minimal
- A new microservice can easily be added by adding the details to the `microservices.ts` file.
- All incoming requests are validated with `JOI`.
- Passwords are hashed using bcrypt.
- A decent error logging and handling.
