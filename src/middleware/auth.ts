import * as bcrypt from 'bcrypt'
// import Bluebird, { reject, resolve } from 'bluebird'
import Cookies from 'cookies'
import * as jwt from 'jsonwebtoken'

import { User, UserAddModel } from '../lib/config/models/user'

// export interface UserAddModel{
//     email?: string,
//     password?: string
// }

interface UserViewModel {
    email: string,
    password: string
}

export class UserService {
    private readonly _saltRounds = 12
    private readonly _jwtSecret = "0.rfyj3n9nzhhhsgyw"
    public  _userInfo: UserAddModel = {}
    static get userAttributes() {
        return ['id', 'email']
    }

    private static _user: any

    static get user() {
        return UserService._user
    }

    register(payload: UserAddModel): Promise<UserAddModel> {
        let data: UserAddModel = {}

        return bcrypt.hash(payload.password, this._saltRounds)
            .then(async password => {
                const user = await User.create({
                    ...payload,
                    password,
                    status: "unverified",
                    wallet_balance: 0,
                    plan: "none",
                    role: "user",
                    slug: Math.random().toString(36).substring(2)
                })
                return user
            })
            .then( async(result) =>{
                data =  await result.get()
                return data
            })
            .catch(err => new Error(err)) as any
        // return data
    }

    login({ email, password }: UserAddModel, cookies: Cookies) {
        // console.log(password)
        return User.findOne({ where: { email } })
            .then( async user => {  
                // console.log(user);
                              
                if(user && await bcrypt.compare(password, user!.password!)){
                    const { id, email } = user!
                    let token: string = jwt.sign({ id, email }, this._jwtSecret)
                    cookies.set("auth_token", token, {
                        httpOnly: true,
                        sameSite: "lax",
                        maxAge: 60 * 60 * 24 * 14,
                        secure: false
                    })
                    return user.get()
                }
                else return false
            })
    }

    verifyToken(token: string) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this._jwtSecret, (err, decoded: any) => {
                if (err) {
                    resolve(false)
                    return
                }

                UserService._user = User.findByPk(decoded['id'])
                resolve(true)
                return
            })
        }) as Promise<boolean>
    }

    getUserById(id: number) {
        return User.findByPk(id, {})
    }
}

