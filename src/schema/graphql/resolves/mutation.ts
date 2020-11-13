import { ApolloError, AuthenticationError, UserInputError } from 'apollo-server-express';
import Cookies from 'cookies';
import { Request, Response } from 'express'
import { Deposit, depositStatus } from '../../../lib/config/models/deposit';
import { Plan, planNames } from '../../../lib/config/models/plan';
import { IPlanUsersStatus, PlanUsers } from '../../../lib/config/models/planUser';
// import validator from 'validator';
import { User, UserAddModel } from "../../../lib/config/models/user";
import { Withdrawal, withdrawalStatus } from '../../../lib/config/models/withdrawal';
import { UserService } from '../../../middleware/auth';


export interface IRequestResponseCookies {
    req?: Request
    res?: Response
    cookies?: Cookies
    user?: boolean
}
interface IArgs {
    input: UserAddModel
}

interface IDepositRequest {
    input: { userId: string, amount: number, plan: planNames }
}
interface IWithdrawalRequest {
    input: { userId: number, amount: number, }
}
interface IActivateDepositProps {
    input: { id: number }
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
    },
    async depositRequest(parent: void, args: IDepositRequest, { user }: IRequestResponseCookies) {
        if (!user) return new AuthenticationError("Not Authorized")

        let result = await Deposit.create({
            userId: UserService.user.id!,
            plan: args.input.plan,
            amount: args.input.amount,
            status: depositStatus.pending,
            slug: Math.random().toString(36).substring(2),
            wallet_balance: UserService.user.wallet_balance,
        })

        if (result.get().id) {
            return {
                message: "successful",
                status: true,
                referenceId: result.slug
            }
        } else {
            return {
                message: "could not place deposit request",
                status: false
            }
        }
    },
    async activateDeposit(parent: void, args: IActivateDepositProps, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")

        return Deposit.findByPk(args.input.id)
            .then(async deposit => {
                const user = await User.findByPk(deposit?.userId)
                const plan = await Plan.findOne({ where: { name: deposit!.plan } })

                deposit!.status = depositStatus.accepted

                user!.plan = plan!.name
                // user!.wallet_balance = deposit?.amount!
                const activePlan = await PlanUsers.create({
                    planId: plan!.id,
                    userId: user!.id,
                    amount: deposit?.amount,
                    count: 0,
                    duration: plan?.duration,
                    status: IPlanUsersStatus.active,
                    rate: plan?.rate,
                    earnings: 0
                })
                // console.log("check >>>>>>", await user?.get())
                await user!.save()
                await deposit?.save()
                await plan?.save()
                // return user?.get()
                return {
                    message: "successful",
                    status: true,
                }
            })
            .catch(err => {
                console.log(err);
                return {
                    message: "Unsuccessful",
                    status: false,
                }
            })
    },
    async deleteDepositRequest(parent: void, args: IActivateDepositProps, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")

        return Deposit.findByPk(args.input.id)
            .then(async deposit => {
                await deposit?.destroy()
                return {
                    message: "Successful",
                    status: true,
                }
            })
            .catch(err => {
                console.log(err);
                return {
                    message: "Unsuccessful",
                    status: false,
                }
            })

    },
    async withdrawalRequest(parent: void, args: IWithdrawalRequest, { user }: IRequestResponseCookies) {
        if (!user) return new AuthenticationError("Not Authorized")

        if(args.input.amount > UserService.user.earnings!){
            return new UserInputError("Amount greater than wallet balance")
        }
        return Withdrawal.create({
            userId: UserService.user.id!,
            plan: planNames.none,
            amount: args.input.amount,
            status: withdrawalStatus.pending,
            slug: Math.random().toString(36).substring(2),
            wallet_balance: UserService.user.wallet_balance,
            coin_address: UserService.user.coin_address!
        })
        .then( result => {
            if (result.get().id) {
                return {
                    message: "successful",
                    status: true,
                    referenceId: result.slug
                }
            } else {
                return new UserInputError("Amount greater than wallet balance")
            }
        })
        .catch( err => {
            return new ApolloError("could not place withdrawal request");
        })
    },
}