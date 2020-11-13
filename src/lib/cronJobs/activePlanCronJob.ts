import cron from "node-cron"
import { History, historyStatus } from "../config/models/history"
import { Plan, planNames, planType } from "../config/models/plan"
import { IPlanUsersStatus, PlanUsers } from "../config/models/planUser"
import { User } from "../config/models/user"

export const activePlanCronJob = () => {
    cron.schedule("* * * * *", () => {
        PlanUsers.findAll({ where: { status: IPlanUsersStatus.active } })
            .then(async activePlans => {
                activePlans.map(async planUser => {
                    const plan = await Plan.findByPk(planUser.planId)
                    const user = await User.findByPk(planUser.userId)

                    if (plan?.type === planType.plan && planUser.count <= planUser.duration) {
                        planUser.earnings += planUser.amount * (planUser.rate / 100);
                        planUser.count += 1

                        user!.earnings! += planUser!.earnings!
                        planUser.save()
                        user?.save()
                    }
                    if (planUser.count === planUser.duration || planUser.count > planUser.duration) {
                        planUser.status = IPlanUsersStatus.inactive

                        const addHistory = await History.create({
                            userId: planUser.id,
                            slug: Math.random().toString(36).substring(1),
                            reference_id: Math.random().toString(36).substring(3),
                            plan: planNames[plan!.name],
                            amount: planUser.amount,
                            earnings: planUser.earnings,
                            duration: planUser.duration,
                            status: historyStatus.accepted,
                            rate: planUser.rate,
                            wallet_balance: user?.wallet_balance,
                            coin_address: user!.coin_address!
                        })
                        user!.plan = planNames.none
                        user?.save()
                        planUser.destroy()
                    }
                })
            })
        console.log("running cron job")
    })
}