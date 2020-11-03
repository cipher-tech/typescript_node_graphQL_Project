import { Router } from "express";
import {Request, Response} from 'express'
import { matchedData, validationResult } from "express-validator";
import { UserController } from "../../controllers/userController";
import { UserService,} from "../../middleware/auth";
import { UserAddModel } from "../config/models/user";
import { Rules } from "../validation/validation";

let UserControllers: UserController = new UserController()
let UserAuth: UserService = new  UserService()
export const userRouter = Router()

userRouter.get('/', UserControllers.index)

userRouter.post('/register', Rules['RegisterValidation'], (req: Request, res: Response) =>{
    console.log("body>>> ", req.body);
    
    const errors = validationResult(req)

    if(!errors.isEmpty())
        return res.status(422).json(errors.array())

    const payload = matchedData(req) as UserAddModel
    const user = UserAuth.register(payload)

    return user
})
