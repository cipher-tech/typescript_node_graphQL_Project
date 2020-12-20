"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
const apollo_server_express_1 = require("apollo-server-express");
const deposit_1 = require("../../../lib/config/models/deposit");
const plan_1 = require("../../../lib/config/models/plan");
const planUser_1 = require("../../../lib/config/models/planUser");
const user_1 = require("../../../lib/config/models/user");
const withdrawal_1 = require("../../../lib/config/models/withdrawal");
const auth_1 = require("../../../middleware/auth");
exports.Mutation = {
    async register(_, args, { req, res, cookies }) {
        const UserAuth = new auth_1.UserService();
        const result = await UserAuth.register(args.input).then((data) => data);
        return result;
    },
    async login(parent, args, { req, res, cookies }) {
        const UserLoginAuth = new auth_1.UserService();
        const result = await UserLoginAuth.login(args.input, cookies);
        if (!result) {
            throw new apollo_server_express_1.UserInputError("Email or password incorrect", {
                invalidArgs: args,
            });
        }
        console.log(result);
        return result;
    },
    async depositRequest(parent, args, { user }) {
        if (!user)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        const AllPendingDeposit = await deposit_1.Deposit.findAll({
            where: {
                userId: auth_1.UserService.user.id,
                status: deposit_1.depositStatus.pending
            }
        });
        const userSelectedPlan = await plan_1.Plan.findOne({
            where: {
                name: args.input.plan,
            }
        });
        let planIsOfSameType;
        if (AllPendingDeposit.length > 0) {
            AllPendingDeposit.forEach((deposit) => {
                return plan_1.Plan.findOne({
                    where: {
                        name: deposit.plan
                    }
                }).then(userPlan => {
                    if ((userPlan === null || userPlan === void 0 ? void 0 : userPlan.type) === (userSelectedPlan === null || userSelectedPlan === void 0 ? void 0 : userSelectedPlan.type)) {
                        console.log((userPlan === null || userPlan === void 0 ? void 0 : userPlan.type) === (userSelectedPlan === null || userSelectedPlan === void 0 ? void 0 : userSelectedPlan.type), "kkkkk");
                        planIsOfSameType = true;
                    }
                    else
                        planIsOfSameType = false;
                });
            });
        }
        if (planIsOfSameType) {
            console.log("of same type ", planIsOfSameType);
            return {
                message: "You already have a pending plan of this type",
                status: false,
                referenceId: "none"
            };
        }
        const isUserOnPlan = await planUser_1.PlanUsers.findAll({
            where: {
                userId: auth_1.UserService.user.id,
            }
        });
        if (isUserOnPlan.length > 0) {
            isUserOnPlan.forEach(async (userActivePlan) => {
                const userPlan = await plan_1.Plan.findOne({
                    where: {
                        id: userActivePlan.planId
                    }
                });
                if (userPlan.type === (userSelectedPlan === null || userSelectedPlan === void 0 ? void 0 : userSelectedPlan.type)) {
                    return {
                        message: "You already have an active plan of this type",
                        status: false,
                        referenceId: "none"
                    };
                }
            });
        }
        let result = await deposit_1.Deposit.create({
            userId: auth_1.UserService.user.id,
            plan: args.input.plan,
            amount: args.input.amount,
            status: deposit_1.depositStatus.pending,
            slug: Math.random().toString(36).substring(2),
            wallet_balance: auth_1.UserService.user.wallet_balance,
        });
        if (result.get().id) {
            return {
                message: "successful",
                status: true,
                referenceId: result.slug
            };
        }
        else {
            return new apollo_server_express_1.ApolloError("Could not place deposit request.");
        }
    },
    async activateDeposit(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        if (auth_1.UserService.user.role !== "admin")
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return deposit_1.Deposit.findByPk(args.input.id)
            .then(async (deposit) => {
            const user = await user_1.User.findByPk(deposit === null || deposit === void 0 ? void 0 : deposit.userId);
            const plan = await plan_1.Plan.findOne({ where: { name: deposit.plan } });
            deposit.status = deposit_1.depositStatus.accepted;
            user.plan = plan.name;
            const activePlan = await planUser_1.PlanUsers.create({
                planId: plan.id,
                userId: user.id,
                amount: deposit === null || deposit === void 0 ? void 0 : deposit.amount,
                count: 0,
                duration: plan === null || plan === void 0 ? void 0 : plan.duration,
                status: planUser_1.IPlanUsersStatus.active,
                rate: plan === null || plan === void 0 ? void 0 : plan.rate,
                earnings: 0
            });
            await user.save();
            await (deposit === null || deposit === void 0 ? void 0 : deposit.save());
            await (plan === null || plan === void 0 ? void 0 : plan.save());
            return {
                message: "successful",
                status: true,
            };
        })
            .catch(err => {
            console.log(err);
            return new apollo_server_express_1.ApolloError("Unsuccessful");
        });
    },
    async cancelDeposit(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        if (auth_1.UserService.user.role !== "admin")
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return deposit_1.Deposit.findByPk(args.input.id)
            .then(async (deposit) => {
            deposit.status = deposit_1.depositStatus.canceled;
            await (deposit === null || deposit === void 0 ? void 0 : deposit.save());
            return {
                message: "successful",
                status: true,
            };
        })
            .catch(err => {
            console.log(err);
            return new apollo_server_express_1.ApolloError("Unsuccessful. could not cancel deposit");
        });
    },
    async cancelWithdrawal(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        if (auth_1.UserService.user.role !== "admin")
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return withdrawal_1.Withdrawal.findByPk(args.input.id)
            .then(async (withdrawal) => {
            withdrawal.status = withdrawal_1.withdrawalStatus.canceled;
            await (withdrawal === null || withdrawal === void 0 ? void 0 : withdrawal.save());
            return {
                message: "successful",
                status: true,
            };
        })
            .catch(err => {
            console.log(err);
            return new apollo_server_express_1.ApolloError("Unsuccessful. could not cancel withdrawal");
        });
    },
    async deleteDepositRequest(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        if (auth_1.UserService.user.role !== "admin")
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return deposit_1.Deposit.findByPk(args.input.id)
            .then(async (deposit) => {
            await (deposit === null || deposit === void 0 ? void 0 : deposit.destroy());
            return {
                message: "Successful",
                status: true,
            };
        })
            .catch(err => {
            console.log(err);
            return new apollo_server_express_1.ApolloError("Unsuccessful. could not delete deposit");
        });
    },
    async withdrawalRequest(parent, args, { user }) {
        if (!user)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        if (args.input.amount > auth_1.UserService.user.earnings) {
            return new apollo_server_express_1.UserInputError("Amount greater than wallet balance");
        }
        return withdrawal_1.Withdrawal.create({
            userId: auth_1.UserService.user.id,
            plan: plan_1.planNames.none,
            amount: args.input.amount,
            status: withdrawal_1.withdrawalStatus.pending,
            slug: Math.random().toString(36).substring(2),
            wallet_balance: auth_1.UserService.user.wallet_balance,
            coin_address: auth_1.UserService.user.coin_address
        })
            .then(result => {
            if (result.get().id) {
                return {
                    message: "successful",
                    status: true,
                    referenceId: result.slug
                };
            }
            else {
                return new apollo_server_express_1.UserInputError("Amount greater than wallet balance");
            }
        })
            .catch(err => {
            return new apollo_server_express_1.ApolloError("could not place withdrawal request");
        });
    },
    async activateWithdrawal(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        if (auth_1.UserService.user.role !== "admin")
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return withdrawal_1.Withdrawal.findByPk(args.input.id)
            .then(async (withdrawal) => {
            withdrawal.status = withdrawal_1.withdrawalStatus.accepted;
            await (withdrawal === null || withdrawal === void 0 ? void 0 : withdrawal.save());
            return {
                message: "successful",
                status: true,
            };
        })
            .catch(err => {
            console.log(err);
            return new apollo_server_express_1.ApolloError("could not accept withdrawal ");
        });
    },
    async deleteWithdrawalRequest(parent, args, { user: isAuthorized }) {
        if (!isAuthorized)
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        if (auth_1.UserService.user.role !== "admin")
            return new apollo_server_express_1.AuthenticationError("Not Authorized");
        return withdrawal_1.Withdrawal.findByPk(args.input.id)
            .then(async (withdrawal) => {
            await (withdrawal === null || withdrawal === void 0 ? void 0 : withdrawal.destroy());
            return {
                message: "Successful",
                status: true,
            };
        })
            .catch(err => {
            console.log(err);
            return new apollo_server_express_1.ApolloError("could not accept withdrawal ");
        });
    },
    logout() {
        return true;
    }
};
