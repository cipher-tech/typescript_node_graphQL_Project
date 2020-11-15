import { Request, Response } from 'express'
import Cookies from 'cookies';

import { User, UserAddModel } from "../../../lib/config/models/user";
import { UserService } from '../../../middleware/auth';
import { IRequestResponseCookies } from './mutation';
import { userInfo } from 'os';
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { Deposit, depositStatus } from '../../../lib/config/models/deposit';
import { Withdrawal } from '../../../lib/config/models/withdrawal';

interface IRequestResponse {
    req?: Request
    res?: Response
    cookies?: Cookies
}

interface IArgs {
    input: UserAddModel
}

export const Query = {
    helloWorld(_: void, args: { name: string }, { req, res }: IRequestResponse): string {
        return `👋 Hello world!!!!  `
    },
    getUser(_: void, args: IArgs, { req, res, cookies, user }: IRequestResponseCookies) {
        console.log(user);
        if (!user) return new AuthenticationError("Not Authorized")
        // console.log(">>>>>>>>", UserService.user );
        return UserService.user
    },
    async getUserPendingDeposits(parent: void, args: void, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")

        return Deposit.findAll({
            where: {
                userId: UserService.user.id,
                status: depositStatus.pending,
            }
        })
            .then(async deposits => {
                return deposits
            })
            .catch(err => {
                console.log(err);
                throw new Error(err)
            })
    },
    async getUserDeposits(parent: void, args: void, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")

        return Deposit.findAll({
            where: {
                userId: UserService.user.id,
                status: depositStatus.accepted
            }
        })
            .then(async deposits => {
                return deposits
            })
            .catch(err => {
                console.log(err);
                throw new Error(err)
            })
    },
    async getPendingDeposits(parent: void, args: void, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")
        if (UserService.user.role !== "admin") return new AuthenticationError("Not Authorized")

        return Deposit.findAll({ where: { status: depositStatus.pending }, include: "users" })
            .then(async deposits => {
                return deposits
            })
            .catch(err => {
                console.log(err);
                throw new Error(err)
            })
    },
    async getUserPendingWithdrawals(parent: void, args: void, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")

        return Withdrawal.findAll({ where: { 
            userId: UserService.user.id,
            status: depositStatus.pending }
        })
            .then(async withdrawal => {
                return withdrawal
            })
            .catch(err => {
                console.log(err);
                throw new ApolloError("could not fetch Withdrawals")
            })
    },
    async getUserWithdrawals(parent: void, args: void, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")

        return Withdrawal.findAll({ where: { 
            userId: UserService.user.id
            }
        })
            .then(async withdrawal => {
                return withdrawal
            })
            .catch(err => {
                console.log(err);
                throw new ApolloError("could not fetch Withdrawals")
            })
    },
    async getPendingWithdrawals(parent: void, args: void, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")
        if (UserService.user.role !== "admin") return new AuthenticationError("Not Authorized")

        return Withdrawal.findAll({ where: { status: depositStatus.pending }, include: "users" })
            .then(async withdrawal => {
                return withdrawal
            })
            .catch(err => {
                console.log(err);
                throw new ApolloError("could not fetch Withdrawals")
            })
    },
}