import {IResolvers} from 'graphql-tools'
import { Query } from './query';
import { Mutation } from './mutation';

const resolverMap: IResolvers = {
    Query,
    Mutation
}

export default resolverMap;