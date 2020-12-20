"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const graphql_depth_limit_1 = __importDefault(require("graphql-depth-limit"));
const http_1 = require("http");
const bodyParser = __importStar(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const cookies_1 = __importDefault(require("cookies"));
const schema_1 = __importDefault(require("./schema"));
const routes_1 = require("./lib/routes");
const auth_1 = require("./middleware/auth");
const modelReletionships_1 = require("./lib/config/models/modelReletionships");
const cronJobs_1 = require("./lib/cronJobs/");
const app = express_1.default();
const server = new apollo_server_express_1.ApolloServer({
    schema: schema_1.default,
    validationRules: [graphql_depth_limit_1.default(7)],
    context: async ({ req, res }) => {
        const cookies = new cookies_1.default(req, res);
        const token = cookies.get("auth_token");
        console.log('token>>>>', token);
        const user = await new auth_1.UserService().verifyToken(token);
        return { req, res, user, cookies };
    }
});
var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
};
app.use(cors_1.default(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression_1.default());
app.use('/', routes_1.userRouter);
modelReletionships_1.modelAssociation();
server.applyMiddleware({ app, path: "/graphql", cors: false });
const httpServer = http_1.createServer(app);
cronJobs_1.PlanCronJob();
httpServer.listen({ port: 8000 }, () => console.log(`\n  GraphQL server is now running 
    on http://localhost:8000/graphql`));
