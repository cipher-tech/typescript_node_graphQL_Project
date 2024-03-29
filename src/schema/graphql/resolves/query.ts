import { Request, Response } from 'express'
import Cookies from 'cookies';

import { User, UserAddModel } from "../../../lib/config/models/user";
import { UserService } from '../../../middleware/auth';
import { IRequestResponseCookies } from './mutation';
import { userInfo } from 'os';
import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { Deposit, depositStatus } from '../../../lib/config/models/deposit';
import { Withdrawal, withdrawalStatus } from '../../../lib/config/models/withdrawal';
import sequelize from 'sequelize';

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
    getUsers(_: void, args: IArgs, { req, res, cookies, user }: IRequestResponseCookies) {
        console.log(user);
        if (!user) return new AuthenticationError("Not Authorized")
        if (UserService.user.role !== "admin") return new AuthenticationError("Not Authorized")

        return User.findAll({ limit: 80 })
            .then(users => users)
            .catch(err => {
                throw new ApolloError("could not fetch Withdrawals")
            })
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
        // if (UserService.user.role !== "admin") return new AuthenticationError("Not Authorized")

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

        return Withdrawal.findAll({
            where: {
                userId: UserService.user.id,
                status: depositStatus.pending
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
    async getUserWithdrawals(parent: void, args: void, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")

        return Withdrawal.findAll({
            where: {
                userId: UserService.user.id,
                status: depositStatus.accepted
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
    async getUserStats(parent: void, args: void, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")

        const totalEarnings = await User.findByPk(UserService.user.id, {
            attributes: [
                [sequelize.fn("SUM", sequelize.col("earnings")), "totalEarnings"],
            ],
        })
        const totalDeposits = await Deposit.findAll({
            where: { userId: UserService.user.id, status: depositStatus.accepted },
            attributes: [
                [sequelize.fn("SUM", sequelize.col("amount")), "totalDeposits"],
            ],
        })
        const totalWithdrawal = await Withdrawal.findAll({
            where: { userId: UserService.user.id, status: withdrawalStatus.accepted },
            attributes: [
                [sequelize.fn("SUM", sequelize.col("amount")), "totalWithdrawal"],
            ],
        })
        console.log({
            totalEarnings: +totalEarnings!.get('totalEarnings')!,
            totalDeposits: +totalDeposits[0].get("totalDeposits")!,
            totalWithdrawal: +totalWithdrawal[0].get("totalWithdrawal")!,
            totalBalance: UserService.user.wallet_balance
        });

        return {
            totalBalance: UserService.user.wallet_balance,
            totalEarnings: +totalEarnings!.get('totalEarnings')!,
            totalDeposits: +totalDeposits[0].get("totalDeposits")!,
            totalWithdrawal: +totalWithdrawal[0].get("totalWithdrawal")!,
            activePlan: UserService.user.plan,
        }

    },
    async getAdminStats(parent: void, args: void, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")

        const totalEarnings = await User.findAll({
            attributes: [
                [sequelize.fn("SUM", sequelize.col("earnings")), "totalEarnings"],
                [sequelize.fn("SUM", sequelize.col("wallet_balance")), "totalBalance"],
            ],
        })
        const totalDeposits = await Deposit.findAll({
            where: { userId: UserService.user.id },
            attributes: [
                [sequelize.fn("SUM", sequelize.col("amount")), "totalDeposits"],
            ], 
        })
        const totalWithdrawal = await Withdrawal.findAll({
            where: { userId: UserService.user.id },
            attributes: [   
                [sequelize.fn("SUM", sequelize.col("amount")), "totalWithdrawal"],
            ],
        })
        console.log({
            totalEarnings: +totalEarnings![0].get('totalEarnings')!,
            totalDeposits: +totalDeposits[0].get("totalDeposits")!,
            totalWithdrawal: +totalWithdrawal[0].get("totalWithdrawal")!,
            totalBalance: +totalEarnings![0].get('totalBalance')!
        });

        return {
            totalEarnings: +totalEarnings![0].get('totalEarnings')!,
            totalDeposits: +totalDeposits[0].get("totalDeposits")!,
            totalWithdrawal: +totalWithdrawal[0].get("totalWithdrawal")!,
            totalBalance: +totalEarnings![0].get('totalBalance')!
        }

    },
    async getAdminDeposits(parent: void, args: void, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")
        if (UserService.user.role !== "admin") return new AuthenticationError("Not Authorized")

        return Deposit.findAll({
            where: {
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
    async getAdminWithdrawals(parent: void, args: void, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")
        if (UserService.user.role !== "admin") return new AuthenticationError("Not Authorized")

        return Withdrawal.findAll({
            where: {
                status: depositStatus.accepted
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
}