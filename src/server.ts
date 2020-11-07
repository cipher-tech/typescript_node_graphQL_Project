import express from "express";
import {ApolloServer} from "apollo-server-express"
import depthLimit from "graphql-depth-limit"
import {createServer} from 'http'
import * as bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import Cookies from "cookies";


import schema from './schema'
import { userRouter } from "./lib/routes";
import { UserService } from "./middleware/auth";
import { modelAssociation } from "./lib/config/models/modelReletionships";

const app = express()
const server = new ApolloServer({
    schema,
    validationRules: [depthLimit(7)],
    context: async ({req, res} ) => {
        const cookies = new Cookies(req, res)
        const token = cookies.get("auth_token")
        console.log('token>>>>', token);
        
        const user = await new UserService().verifyToken(token!)
        return {req,res, user, cookies }
    }
});

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true // <-- REQUIRED backend setting
  };
app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use("*", cors());
app.use(compression());
app.use('/', userRouter);

server.applyMiddleware({app, path: "/graphql", cors: false});

const httpServer = createServer(app);

httpServer.listen(
    {port: 8000},
    (): void => console.log(`\n  GraphQL server is now running 
    on http://localhost:8000/graphql`)
)

modelAssociation()