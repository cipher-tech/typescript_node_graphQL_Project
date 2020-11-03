import {Request, Response} from 'express'
import { User, UserAddModel} from '../lib/config/models/user'

export class UserController {
    public index (req: Request, res: Response){
        User.findAll({})
        .then((users: Array<UserAddModel>) => res.json(users))
        .catch((err: Error) => res.status(500).json(err))
    }
}