import {Request, Response} from 'express'
import Cookies from 'cookies';

import { UserAddModel } from "../../../lib/config/models/user";
import { UserService } from '../../../middleware/auth';
import { IRequestResponseCookies } from './mutation';
import { userInfo } from 'os';
import { AuthenticationError } from 'apollo-server-express';

interface IRequestResponse {
    req?: Request
    res?: Response 
    cookies?: Cookies
}

interface IArgs {
    input: UserAddModel
}

export const Query = {
    helloWorld(_: void, args: {name: string}, {req,res}: IRequestResponse): string{
        return `👋 Hello world!!!!  `
    },
    getUser(_: void, args: IArgs, { req, res, cookies, user }: IRequestResponseCookies){
        console.log(user);
        if(!user) return new AuthenticationError("Not Authorized")
        // console.log(">>>>>>>>", UserService.user );
        return UserService.user
    }
}