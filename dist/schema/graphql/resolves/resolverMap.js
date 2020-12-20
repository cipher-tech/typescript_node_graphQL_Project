"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const query_1 = require("./query");
const mutation_1 = require("./mutation");
const resolverMap = {
    Query: query_1.Query,
    Mutation: mutation_1.Mutation
};
exports.default = resolverMap;
