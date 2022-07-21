import { ApolloError, AuthenticationError, UserInputError } from 'apollo-server-express';
import Cookies from 'cookies';
import { Request, Response } from 'express'
import { Deposit, depositStatus } from '../../../lib/config/models/deposit';
import { Plan, planNames } from '../../../lib/config/models/plan';
import { IPlanUsersStatus, PlanUsers } from '../../../lib/config/models/planUser';
// import validator from 'validator';
import { User, UserAddModel } from "../../../lib/config/models/user";
import { Withdrawal, withdrawalStatus } from '../../../lib/config/models/withdrawal';
import { Mailer, serverEmail } from '../../../lib/mail/config';
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

        // if(UserService.user.plan != "none") {
        //     return {
        //         message: "already on a plan, could not place deposit request",
        //         status: false
        //     } 
        // }
        const AllPendingDeposit = await Deposit.findAll({
            where: {
                userId: UserService.user.id,
                status: depositStatus.pending
            }
        })

            const userSelectedPlan = await Plan.findOne({
                where: {
                    name: args.input.plan,
                }
            })
            let planIsOfSameType;
            if (AllPendingDeposit.length > 0) {
                AllPendingDeposit.forEach((deposit) => {
                    return Plan.findOne({
                        where: {
                            name: deposit.plan
                        }
                    }).then( userPlan => {
                        if (userPlan?.type === userSelectedPlan?.type) {
                            console.log(userPlan?.type === userSelectedPlan?.type, "kkkkk");
                            planIsOfSameType = true;
                            
                        }
                        else planIsOfSameType = false;
                    })

                })
            }
            if (planIsOfSameType) {
                console.log("of same type ", planIsOfSameType);
                return {
                    message: "You already have a pending plan of this type",
                    status: false,
                    referenceId: "none"
                }
            }

            const isUserOnPlan = await PlanUsers.findAll({
                where: {
                    userId: UserService.user.id!,
                }
            })
            if (isUserOnPlan.length > 0) {
                isUserOnPlan.forEach(async userActivePlan => {
                    const userPlan = await Plan.findOne({
                        where: {
                            id: userActivePlan.planId
                        }
                    })

                    if (userPlan!.type === userSelectedPlan?.type) {
                        return {
                            message: "You already have an active plan of this type",
                            status: false,
                            referenceId: "none"
                        }
                    }
                })
            }

            let result = await Deposit.create({
                userId: UserService.user.id!,
                plan: args.input.plan,
                amount: args.input.amount,
                status: depositStatus.pending,
                slug: Math.random().toString(36).substring(2),
                wallet_balance: UserService.user.wallet_balance,
            })

            if (result.get().id) {
                
                Mailer(UserService.user.email, "Deposit request Successful", `<h1> 
                digitalDreams </h1>
                <h3>Deposit request Successful</h3>
                <p style={{ margin: "0px" }}>
                 Your deposit request was Successful.
                 <br />
                 Details:
                </p>
                <p
                    style={{
                        fontSize: "14px",
                        color: "rgb(51, 51, 51)",
                        fontFamily: "arial, sans-serif",
                        margin: "0px",
                        padding: "8px 12px 0px",
                    }}
                >
                    <span> First Name: <b>${UserService.user.first_name}</b> </span> <br />
                    <span> Email: <b>${UserService.user.email}</b> </span> <br />
                    <span> Plan: <b>${args.input.plan}</b> </span> <br />
                    <span> Amount: <b>$${args.input.amount}</b> </span> <br />
                    <span> Status: <b>${depositStatus.pending}</b> </span> <br />
                    <span> ref id: <b>${result.slug}</b> </span> <br />
                </p>
                <p>
                    <br />
                    Thanks
                </p>
                <small>digitalDreams 2020</small>`).catch(console.error);
                Mailer(serverEmail, "Deposit request placed", `<h1> 
                digitalDreams </h1>
                <h3>Deposit requested</h3>
                <p style={{ margin: "0px" }}>
                 deposit request placed.
                 <br />
                 Details:
                </p>
                <p
                    style={{
                        fontSize: "14px",
                        color: "rgb(51, 51, 51)",
                        fontFamily: "arial, sans-serif",
                        margin: "0px",
                        padding: "8px 12px 0px",
                    }}
                >
                    
                    <span> First Name: <b>${UserService.user.first_name}</b> </span> <br />
                    <span> Email: <b>${UserService.user.email}</b> </span> <br />
                    <span> Plan: <b>${args.input.plan}</b> </span> <br />
                    <span> Amount: <b>${args.input.amount}</b> </span> <br />
                    <span> Status: <b>${depositStatus.pending}</b> </span> <br />
                    <span> ref id: <b>${result.slug}</b> </span> <br />
                </p>
                <p>
                    <br />
                    Check ur dashboard for more details.
                </p>
                <small>digitalDreams 2020</small>`).catch(console.error);
                return {
                    message: "successful",
                    status: true,
                    referenceId: result.slug
                }
            } else {
                return new ApolloError("Could not place deposit request.")
            }
    },
    async activateDeposit(parent: void, args: IActivateDepositProps, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")
        if (UserService.user.role !== "admin") return new AuthenticationError("Not Authorized")

        return Deposit.findByPk(args.input.id)
            .then(async deposit => {
                const user = await User.findByPk(deposit?.userId)
                const plan = await Plan.findOne({ where: { name: deposit!.plan } })

                deposit!.status = depositStatus.accepted

                user!.plan = plan?.name
                const UserOnPlan = await PlanUsers.findOne({where: {userId: user?.id}})
                // user!.wallet_balance = deposit?.amount!
                if(UserOnPlan?.id){
                    return {
                        message: "Unsuccessful",
                        status: false,
                    }
                }
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
                Mailer(user?.email, "Deposit Confirmed, Plan Activated", `<h1> 
                digitalDreams </h1>
                <h3>Plan Activated</h3>
                <p style={{ margin: "0px" }}>
                 This is to inform you that your deposit has been  Confirmed and your Plan Activated.
                 <br />
                 Details:
                </p>
                <p
                    style={{
                        fontSize: "14px",
                        color: "rgb(51, 51, 51)",
                        fontFamily: "arial, sans-serif",
                        margin: "0px",
                        padding: "8px 12px 0px",
                    }}
                >
                    <span> Plan: <b>${plan?.name}</b> </span> <br />
                    <span> Email: <b>${user?.email}</b> </span> <br />
                    <span> duration: <b>${plan?.duration} days</b> </span> <br />
                    <span> rate: <b>${plan?.rate}%</b> </span> <br />
                    <span> Amount: <b>$${deposit?.amount}</b> </span> <br />
                    <span> Status: <b>${IPlanUsersStatus.active}</b> </span> <br />
                </p>
                <p>
                    <br />
                    Thanks
                </p>
                <small>digitalDreams 2020</small>`).catch(console.error);
                
                Mailer(serverEmail, "Plan Activated", `<h1> 
                digitalDreams </h1>
                <h3>Plan Activated</h3>
                <p style={{ margin: "0px" }}>
                    Plan Activated, you activated a plan from the dashboard.
                 <br />
                 Details:
                </p>
                <p
                    style={{
                        fontSize: "14px",
                        color: "rgb(51, 51, 51)",
                        fontFamily: "arial, sans-serif",
                        margin: "0px",
                        padding: "8px 12px 0px",
                    }}
                >
                    
                <span> Plan: <b>${plan?.name}</b> </span> <br />
                <span> Email: <b>${user?.email}</b> </span> <br />
                <span> duration: <b>${plan?.duration}</b> </span> <br />
                <span> rate: <b>${plan?.rate}</b> </span> <br />
                <span> Amount: <b>${deposit?.amount}</b> </span> <br />
                <span> Status: <b>${IPlanUsersStatus.active}</b> </span> <br />
                </p>
                <p>
                    <br />
                    Check ur dashboard for more details.
                </p>
                <small>digitalDreams 2020</small>`).catch(console.error);
                return {
                    message: "successful",
                    status: true,
                }
            })
            .catch(err => {
                console.log(err);
                return new ApolloError("Unsuccessful")
            })
    },
    async cancelDeposit(parent: void, args: IActivateDepositProps, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")
        if (UserService.user.role !== "admin") return new AuthenticationError("Not Authorized")

        return Deposit.findByPk(args.input.id)
            .then(async deposit => {
                deposit!.status = depositStatus.canceled

                await deposit?.save()
                // return user?.get()
                return {
                    message: "successful",
                    status: true,
                }
            })
            .catch(err => {
                console.log(err);
                return new ApolloError("Unsuccessful. could not cancel deposit")
            })
    },
    async cancelWithdrawal(parent: void, args: IActivateDepositProps, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")
        if (UserService.user.role !== "admin") return new AuthenticationError("Not Authorized")

        return Withdrawal.findByPk(args.input.id)
            .then(async withdrawal => {
                withdrawal!.status = withdrawalStatus.canceled

                await withdrawal?.save()
                // return user?.get()
                return {
                    message: "successful",
                    status: true,
                }
            })
            .catch(err => {
                console.log(err);
                return new ApolloError("Unsuccessful. could not cancel withdrawal")
            })
    },
    async deleteDepositRequest(parent: void, args: IActivateDepositProps, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")
        if (UserService.user.role !== "admin") return new AuthenticationError("Not Authorized")

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
                return new ApolloError("Unsuccessful. could not delete deposit")
            })

    },
    async withdrawalRequest(parent: void, args: IWithdrawalRequest, { user }: IRequestResponseCookies) {
        if (!user) return new AuthenticationError("Not Authorized")

        if (args.input.amount > UserService.user.earnings!) {
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
            .then(result => {
                if (result.get().id) {
                    Mailer(UserService.user.email, "Withdrawal request Successful", `<h1> 
                digitalDreams </h1>
                <h3>Withdrawal request Successful</h3>
                <p style={{ margin: "0px" }}>
                 Your withdrawal request was Successful.
                 <br />
                 Details:
                </p>
                <p
                    style={{
                        fontSize: "14px",
                        color: "rgb(51, 51, 51)",
                        fontFamily: "arial, sans-serif",
                        margin: "0px",
                        padding: "8px 12px 0px",
                    }}
                >
                    <span> First Name: <b>${UserService.user.first_name}</b> </span> <br />
                    <span> Email: <b>${UserService.user.email}</b> </span> <br />
                    <span> Amount: <b>${args.input.amount}</b> </span> <br />
                    <span> Status: <b>${withdrawalStatus.pending}</b> </span> <br />
                    <span> ref id: <b>${result.slug}</b> </span> <br />
                    <span> coin_address: <b>${UserService.user.coin_address!}</b> </span> <br />
                </p>
                <p>
                    <br />
                    Thanks
                </p>
                <small>digitalDreams 2020</small>`).catch(console.error);
                Mailer(serverEmail, "Withdrawal request placed", `<h1> 
                digitalDreams </h1>
                <h3>Withdrawal requested</h3>
                <p style={{ margin: "0px" }}>
                 withdrawal request placed.
                 <br />
                 Details:
                </p>
                <p
                    style={{
                        fontSize: "14px",
                        color: "rgb(51, 51, 51)",
                        fontFamily: "arial, sans-serif",
                        margin: "0px",
                        padding: "8px 12px 0px",
                    }}
                >
                    
                    <span> First Name: <b>${UserService.user.first_name}</b> </span> <br />
                    <span> Email: <b>${UserService.user.email}</b> </span> <br />
                    <span> Amount: <b>${args.input.amount}</b> </span> <br />
                    <span> Status: <b>${withdrawalStatus.pending}</b> </span> <br />
                    <span> ref id: <b>${result.slug}</b> </span> <br />
                </p>
                <p>
                    <br />
                    Check ur dashboard for more details.
                </p>
                <small>digitalDreams 2020</small>`).catch(console.error);
                    return {
                        message: "successful",
                        status: true,
                        referenceId: result.slug
                    }
                } else {
                    return new UserInputError("Amount greater than wallet balance")
                }
            })
            .catch(err => {
                return new ApolloError("could not place withdrawal request");
            })
    },
    async activateWithdrawal(parent: void, args: IActivateDepositProps, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")
        if (UserService.user.role !== "admin") return new AuthenticationError("Not Authorized")

        return Withdrawal.findByPk(args.input.id)
            .then(async withdrawal => {
                withdrawal!.status = withdrawalStatus.accepted
                await withdrawal?.save()
                const user = await User.findByPk(withdrawal?.userId)
                Mailer(user?.email, "withdrawal request Confirmed", `<h1> 
                digitalDreams </h1>
                <h3>withdrawal Confirmed</h3>
                <p style={{ margin: "0px" }}>
                 This is to inform you that your withdrawal request has been  Confirmed.
                 <br />
                 Details:
                </p>
                <p
                    style={{
                        fontSize: "14px",
                        color: "rgb(51, 51, 51)",
                        fontFamily: "arial, sans-serif",
                        margin: "0px",
                        padding: "8px 12px 0px",
                    }}
                >
                    <span> Amount: <b>${withdrawal?.amount}</b> </span> <br />
                    <span> Email: <b>${user?.email}</b> </span> <br />
                    <span> Status: <b>${withdrawalStatus.accepted}</b> </span> <br />
                    <span> Address: <b>${withdrawal?.coin_address}</b> </span> <br />
                </p>
                <p>
                    <br />
                    Thanks
                </p>
                <small>digitalDreams 2020</small>`).catch(console.error);
                
                Mailer(serverEmail, "withdrawal Confirmed", `<h1> 
                digitalDreams </h1>
                <h3>withdrawal Confirmed</h3>
                <p style={{ margin: "0px" }}>
                withdrawal Confirmed from the dashboard.
                 <br />
                 Details:
                </p>
                <p
                    style={{
                        fontSize: "14px",
                        color: "rgb(51, 51, 51)",
                        fontFamily: "arial, sans-serif",
                        margin: "0px",
                        padding: "8px 12px 0px",
                    }}
                >
                    
                <span> Amount: <b>${withdrawal?.amount}</b> </span> <br />
                <span> Email: <b>${user?.email}</b> </span> <br />
                <span> Status: <b>${withdrawalStatus.accepted}</b> </span> <br />
                <span> Address: <b>${withdrawal?.coin_address}</b> </span> <br />
                </p>
                <p>
                    <br />
                    Check ur dashboard for more details.
                </p>
                <small>digitalDreams 2020</small>`).catch(console.error);
                return {
                    message: "successful",
                    status: true,
                }
            })
            .catch(err => {
                console.log(err);
                return new ApolloError("could not accept withdrawal ");
            })
    },
    async deleteWithdrawalRequest(parent: void, args: IActivateDepositProps, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")
        if (UserService.user.role !== "admin") return new AuthenticationError("Not Authorized")

        return Withdrawal.findByPk(args.input.id)
            .then(async withdrawal => {
                await withdrawal?.destroy()
                return {
                    message: "Successful",
                    status: true,
                }
            })
            .catch(err => {
                console.log(err);
                return new ApolloError("could not delete withdrawal ");
            })

    },
    async deleteUser(parent: void, args: IActivateDepositProps, { user: isAuthorized }: IRequestResponseCookies) {
        if (!isAuthorized) return new AuthenticationError("Not Authorized")
        if (UserService.user.role !== "admin") return new AuthenticationError("Not Authorized")

        return User.findByPk(args.input.id)
            .then(async user => {
                await user?.destroy()
                return {
                    message: "Successful",
                    status: "true",
                }
            })
            .catch(err => {
                console.log(err);
                return new ApolloError("could not delete user ");
            })

    },
    logout() {
        return true
    }
}