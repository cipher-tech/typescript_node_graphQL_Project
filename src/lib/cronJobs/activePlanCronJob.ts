import dayjs from "dayjs"
import cron from "node-cron"
import { History, historyStatus } from "../config/models/history"
import { Plan, planNames, planType } from "../config/models/plan"
import { IPlanUsersStatus, PlanUsers } from "../config/models/planUser"
import { User } from "../config/models/user"

export const activePlanCronJob = () => {
    // const day1 = dayjs("2020-11-19 22:42:18")
    // console.log(day1.diff("2020-11-17 22:32:18", "hour") % 24)
    cron.schedule("* 1 * * *", () => {
        PlanUsers.findAll({ where: { status: IPlanUsersStatus.active } })
            .then(async activePlans => {
                activePlans.map(async planUser => {
                    const plan = await Plan.findByPk(planUser.planId)
                    const user = await User.findByPk(planUser.userId)
                    const currentTime = dayjs()

                    console.log(currentTime.diff(planUser.createdAt!, "hour") % 24)
                    
                    if(currentTime.diff(planUser.createdAt!, 'hour') % 24 === 0){
                        if (plan?.type === planType.plan && planUser.count <= planUser.duration) {
                            let earnings = (planUser.amount * (planUser.rate / 100)) / planUser.duration;
                            planUser.earnings += earnings
                            planUser.count += 1
    
                            user!.earnings! += earnings
                            planUser.save()
                            user?.save()
                        }else if(plan?.type === planType.stock && planUser.count <= planUser.duration){
                            let earnings = (planUser.amount * ((Math.floor(Math.random() * 5)) / 100)) / planUser.duration;
                            planUser.earnings += earnings
                            planUser.count += 1
    
                            user!.stock! += earnings
                            planUser.save()
                            user?.save()
                        }else if(plan?.type === planType.shares && planUser.count <= planUser.duration){
                            let earnings = (planUser.amount * ((Math.floor(Math.random() * 7)) / 100)) / planUser.duration;
                            planUser.earnings += earnings
                            planUser.count += 1
    
                            user!.shares! += earnings
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
                    }
                })
            })
        console.log("running cron job")
    })
}