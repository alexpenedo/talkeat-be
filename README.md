# Talkeat Backend

## Overview
This is a backend server for **Talkeat** web application.

##### Database
* **MongoDB**: Talkeat stores all data in a noSQL database, MongoDB.

##### Application
* NestJS is the framework used at application layer.
* The application was written with Typescript as programming language.
* The application can be launched with Docker through the configuration file Dockerfile.

## Requirements

Third party dependencies that should be installed prior to run this piece of software:
* **MongoDB v4.0**
* **NodeJS v10.x.x**
* **Redis v4.0.x**
* **NPM 6.4.x**

## Relevant package dependencies:
* **NestJs v5.1.0**: Framework used for application development.
* **google-cloud/storage v2.0.0**: Library for integration with google-cloud storage
* **Jest v23.4.x**:  Framework for testing.
* **Webpack v.4.16.x**: Library for run application for development

## Installation
After installing all system requirements:

1º Checkout the source code:

```
git clone git@bitbucket.org:alexpenedo/talkeat-be.git
```

2º Install all dependencies

```
npm install
```
## Compile
Compile the Typescript code

```
npm run build
```

## Run
Run next command for launch application for development
```
npm start
```
This command uses env file `env/development.env`. Change environment
variables if it's necessary.


## API Reference

The server contains a swagger module that serves all API documentation, for access to it you need to launch the server and open the path `/swagger`.
## Tests
Command for run all tests
```
npm run test
```

##Docker
##### Requirements
* **Docker v18.x**
* **Docker compose v1.22.x**

Repository contains a `Dockerfile` for build a docker image with next command at
root directory.
```
docker build -t talkeat-be . 
```
Repository contains a `docker-compose.yml` for run Backend, MongoDB and Redis.
```
docker-compose up -d 
```