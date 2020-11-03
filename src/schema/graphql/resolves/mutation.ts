import { UserInputError } from 'apollo-server-express';
import Cookies from 'cookies';
import { Request, Response } from 'express'
// import validator from 'validator';
import { UserAddModel } from "../../../lib/config/models/user";
import { UserService } from '../../../middleware/auth';


export interface IRequestResponseCookies {
    req?: Request
    res?: Response
    cookies?: Cookies
}
interface IArgs {
    input: UserAddModel
}


export const Mutation = {
    async register(_: void, args: IArgs, { req, res, cookies }: IRequestResponseCookies) {
        // console.log(args);
        const UserAuth: UserService = new UserService()
        const result = await UserAuth.register(args.input).then((data) => data)
        return result
    },

    async login(parent: void, args: IArgs, { req, res, cookies }: IRequestResponseCookies) {
        // let errors: string[] = []
        const UserLoginAuth = new UserService()
        const result = await UserLoginAuth.login(args.input, cookies!)

        
        // if(!validator.isEmail(args.input.email!)){
        //     errors.push("Incorrect email format")
        // }
        if (!result) {
            throw new UserInputError("Email or password incorrect", {
                invalidArgs: args,
            })
        }
        console.log(result);
        return result
    }
}