## Node.js Blog API

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/17651518-fabf6fe1-401b-4875-a7ab-c0075f995d69?action=collection%2Ffork&collection-url=entityId%3D17651518-fabf6fe1-401b-4875-a7ab-c0075f995d69%26entityType%3Dcollection%26workspaceId%3D844f7943-5de7-4b14-9ff1-a909d2d47181)

### Tech Stack

- Express
- Postgres
- TypeORM
- TypeScript

### Installation

- Clone the repo
- Run `npm install` to install dependencies
- Run `npm run dev` to start the server with hot reload (ensure you have nodemon installed globally)
- Run `npm run build` to build the the typescript project
- Run `npm start` to start the server in a node environment
- Additionaly, you can create a docker image of project with `npm run build:image`


### Database Schema

![Database Schema(Visualized on DataGrip)](./db-image.png)