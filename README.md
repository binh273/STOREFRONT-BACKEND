# Project Name

STOREFRONT BACKEND

## Requirements

- Nodejs

## Requirements

Check the "REQUIREMENTS.md" file to see the details.

## Installation

To install the dependencies for the project, run the following command:

npm install

## database.json

create file database.json file and copy content to file

{
    "dev": {
      "driver": "pg",
      "host": "127.0.0.1",
      "database": "storefront_dev",
      "user": "admin",
      "password": "postgres"
    },
    "test": {
      "driver": "pg",
      "host": "127.0.0.1",
      "database": "storefront",
      "user": "admin",
      "password": "postgres"
    }
  }

## Environment

create file .env file and copy content to file

ENV=test
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront
POSTGRES_USER=admin
POSTGRES_PASSWORD=postgres
POSTGRES_DEV_DB=storefront_dev
BCRYPT_PASSWORD=binhnnt-Storefront
SALT_ROUNDS=10
TOKEN_SECRET=StorefrontBackend

## docker compose file

create file docker compose.yml file and copy content to file

version: '3.9'

services:
  db:
    image: postgres:latest
    restart: always
    environment:
      POSTGRES_USER : admin 
      POSTGRES_PASSWORD : postgres
      POSTGRES_DB : storefront_dev
    ports:
      - '5432:5432'
    env_file:
      - .env
    volumes:
      - 'postgres:/var/lib/postgresql/data'
volumes:
  postgres: 

## Formatting the Source Code

To format the source code of the project using Prettier, run the following command:

npm run prettier


## Checking the Source Code

To check the source code of the project using ESLint, run the following command:

npm run lint

## Running docker compose

To run the project, run the following commands:

docker-compose up

## Running the Project

To run the project, run the following commands:

npm run start

## Running DB-migrete up 

To run db-migrate up , run the following commands:

npm run db-migrateup

## Running Tests

To run the tests of the project using Jasmine, run the following command:

npm run test


The project will start and you can access it at [http://localhost:3000].



