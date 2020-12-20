"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
const user_1 = require("../../../lib/config/models/user");
const auth_1 = require("../../../middleware/auth");
const apollo_server_express_1 = require("apollo-server-express");
const deposit_1 = require("../../../lib/config/models/deposit");
const withdrawal_1 = require("../../../lib/config/models/withdrawal");
const sequelize_1 = __importDefault(require("sequelize"));
exports.Query = {
    helloWorld(_, args, { req, res }) {
        return `👋 Hello world!!!!  `;
    },
    getUser(_, args, { req, res, cookies, user }) {
        console.log(user);
        if (!user)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return auth_1.UserService.user;
    },
    getUsers(_, args, { req, res, cookies, user }) {
        console.log(user);
        if (!user)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        if (auth_1.UserService.user.role !== "admin")
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return user_1.User.findAll({ limit: 80 })
            .then(users => users)
            .catch(err => {
            throw new apollo_server_express_1.ApolloError("could not fetch Withdrawals");
        });
    },
    async getUserPendingDeposits(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return deposit_1.Deposit.findAll({
            where: {
                userId: auth_1.UserService.user.id,
                status: deposit_1.depositStatus.pending,
            }
        })
            .then(async (deposits) => {
            return deposits;
        })
            .catch(err => {
            console.log(err);
            throw new Error(err);
        });
    },
    async getUserDeposits(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return deposit_1.Deposit.findAll({
            where: {
                userId: auth_1.UserService.user.id,
                status: deposit_1.depositStatus.accepted
            }
        })
            .then(async (deposits) => {
            return deposits;
        })
            .catch(err => {
            console.log(err);
            throw new Error(err);
        });
    },
    async getPendingDeposits(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        if (auth_1.UserService.user.role !== "admin")
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return deposit_1.Deposit.findAll({ where: { status: deposit_1.depositStatus.pending }, include: "users" })
            .then(async (deposits) => {
            return deposits;
        })
            .catch(err => {
            console.log(err);
            throw new Error(err);
        });
    },
    async getUserPendingWithdrawals(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return withdrawal_1.Withdrawal.findAll({
            where: {
                userId: auth_1.UserService.user.id,
                status: deposit_1.depositStatus.pending
            }
        })
            .then(async (withdrawal) => {
            return withdrawal;
        })
            .catch(err => {
            console.log(err);
            throw new apollo_server_express_1.ApolloError("could not fetch Withdrawals");
        });
    },
    async getUserWithdrawals(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return withdrawal_1.Withdrawal.findAll({
            where: {
                userId: auth_1.UserService.user.id,
                status: deposit_1.depositStatus.accepted
            }
        })
            .then(async (withdrawal) => {
            return withdrawal;
        })
            .catch(err => {
            console.log(err);
            throw new apollo_server_express_1.ApolloError("could not fetch Withdrawals");
        });
    },
    async getPendingWithdrawals(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        if (auth_1.UserService.user.role !== "admin")
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return withdrawal_1.Withdrawal.findAll({ where: { status: deposit_1.depositStatus.pending }, include: "users" })
            .then(async (withdrawal) => {
            return withdrawal;
        })
            .catch(err => {
            console.log(err);
            throw new apollo_server_express_1.ApolloError("could not fetch Withdrawals");
        });
    },
    async getUserStats(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        const totalEarnings = await user_1.User.findByPk(auth_1.UserService.user.id, {
            attributes: [
                [sequelize_1.default.fn("SUM", sequelize_1.default.col("earnings")), "totalEarnings"],
            ],
        });
        const totalDeposits = await deposit_1.Deposit.findAll({
            where: { userId: auth_1.UserService.user.id, status: deposit_1.depositStatus.accepted },
            attributes: [
                [sequelize_1.default.fn("SUM", sequelize_1.default.col("amount")), "totalDeposits"],
            ],
        });
        const totalWithdrawal = await withdrawal_1.Withdrawal.findAll({
            where: { userId: auth_1.UserService.user.id, status: withdrawal_1.withdrawalStatus.accepted },
            attributes: [
                [sequelize_1.default.fn("SUM", sequelize_1.default.col("amount")), "totalWithdrawal"],
            ],
        });
        console.log({
            totalEarnings: +totalEarnings.get('totalEarnings'),
            totalDeposits: +totalDeposits[0].get("totalDeposits"),
            totalWithdrawal: +totalWithdrawal[0].get("totalWithdrawal"),
            totalBalance: auth_1.UserService.user.wallet_balance
        });
        return {
            totalBalance: auth_1.UserService.user.wallet_balance,
            totalEarnings: +totalEarnings.get('totalEarnings'),
            totalDeposits: +totalDeposits[0].get("totalDeposits"),
            totalWithdrawal: +totalWithdrawal[0].get("totalWithdrawal"),
            activePlan: auth_1.UserService.user.plan,
        };
    },
    async getAdminStats(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        const totalEarnings = await user_1.User.findAll({
            attributes: [
                [sequelize_1.default.fn("SUM", sequelize_1.default.col("earnings")), "totalEarnings"],
                [sequelize_1.default.fn("SUM", sequelize_1.default.col("wallet_balance")), "totalBalance"],
            ],
        });
        const totalDeposits = await deposit_1.Deposit.findAll({
            where: { userId: auth_1.UserService.user.id },
            attributes: [
                [sequelize_1.default.fn("SUM", sequelize_1.default.col("amount")), "totalDeposits"],
            ],
        });
        const totalWithdrawal = await withdrawal_1.Withdrawal.findAll({
            where: { userId: auth_1.UserService.user.id },
            attributes: [
                [sequelize_1.default.fn("SUM", sequelize_1.default.col("amount")), "totalWithdrawal"],
            ],
        });
        console.log({
            totalEarnings: +totalEarnings[0].get('totalEarnings'),
            totalDeposits: +totalDeposits[0].get("totalDeposits"),
            totalWithdrawal: +totalWithdrawal[0].get("totalWithdrawal"),
            totalBalance: +totalEarnings[0].get('totalBalance')
        });
        return {
            totalEarnings: +totalEarnings[0].get('totalEarnings'),
            totalDeposits: +totalDeposits[0].get("totalDeposits"),
            totalWithdrawal: +totalWithdrawal[0].get("totalWithdrawal"),
            totalBalance: +totalEarnings[0].get('totalBalance')
        };
    },
    async getAdminDeposits(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        if (auth_1.UserService.user.role !== "admin")
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return deposit_1.Deposit.findAll({
            where: {
                status: deposit_1.depositStatus.accepted
            }
        })
            .then(async (deposits) => {
            return deposits;
        })
            .catch(err => {
            console.log(err);
            throw new Error(err);
        });
    },
    async getAdminWithdrawals(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        if (auth_1.UserService.user.role !== "admin")
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return withdrawal_1.Withdrawal.findAll({
            where: {
                status: deposit_1.depositStatus.accepted
            }
        })
            .then(async (withdrawal) => {
            return withdrawal;
        })
            .catch(err => {
            console.log(err);
            throw new apollo_server_express_1.ApolloError("could not fetch Withdrawals");
        });
    },
};
