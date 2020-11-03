import {Request, Response} from 'express'

import { UserAddModel } from "../../../lib/config/models/user";
import { UserService } from '../../../middleware/auth';

interface IRequestResponse {
    req?: Request
    res?: Response
}
interface IArgs {
    input: UserAddModel
}

export const Query = {
    helloWorld(_: void, args: {name: string}, {req,res}: IRequestResponse): string{
        return `👋 Hello world!!!!  `
    }
}