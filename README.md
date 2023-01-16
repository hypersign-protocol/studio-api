

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Concepts with code commits
Added basic project st. with following features

- [Basic project st.](https://github.com/hypersign-protocol/studio-api/commit/d80f266d6ed4a458c66257b60b1df2bd84d1622b)
- [Modules](https://github.com/hypersign-protocol/studio-api/commit/0c27814642feee7ff4a517fd4cce257273ce683d)
- [Services](https://github.com/hypersign-protocol/studio-api/commit/0c27814642feee7ff4a517fd4cce257273ce683d)
- [Controllers](https://github.com/hypersign-protocol/studio-api/commit/0c27814642feee7ff4a517fd4cce257273ce683d)
- [Middleware](https://github.com/hypersign-protocol/studio-api/commit/9a6b7b396685cf9d9b592cfacb8e852cf918082f)
- [Swagger Doc](https://github.com/hypersign-protocol/studio-api/commit/e0b23fba36076c97daeaed8e6fbce7d0cb1abf24)
- [Validation](https://github.com/hypersign-protocol/studio-api/commit/4e73e7cbcfe699111581d53ad4c5d9a2bbca8260)
- [Exceptions](https://github.com/hypersign-protocol/studio-api/commit/bd6959b50216cded979309f62a8936c111d3b947)
- [DTOs](https://github.com/hypersign-protocol/studio-api/commit/0c27814642feee7ff4a517fd4cce257273ce683d)
- [Mongo Database connection](https://github.com/hypersign-protocol/studio-api/commit/357436181e4a525fe50b2c8cc4a50c016a437489)
- [environment var](https://github.com/hypersign-protocol/studio-api/commit/2d119e6898a772dcf6ff54e477eb5d354e9b4e18)


## Architecture

![img](https://camo.githubusercontent.com/c26967122228485ff75c80f03d4c9816759bc8fd0dd1a9477edb9a150f92479e/68747470733a2f2f6d656469612e646973636f72646170702e6e65742f6174746163686d656e74732f313032363338323037363937363537343532342f313034393932323436383531303434393636342f696d6167652e706e673f77696474683d31313535266865696768743d363631)

## Pre-requisites

Node version `v14.20.0`

```bash
npm i -g @nestjs/cli
```


## Use full commands

```bash
## Generate a new module 
nest g module <module-name>

## Generate a controller
nest g controller <module-name/controllers/controller-name>

## Generate a service
nest g service <module-name/services/service-name>

## Generate a  middleware
nest g middleware <module-name/middlewares/middleware-name>
```


## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Docs

- http://localhost:3001/api
- http://localhost:3001/api-json