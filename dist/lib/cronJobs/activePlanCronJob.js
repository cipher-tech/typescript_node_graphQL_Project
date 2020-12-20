"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activePlanCronJob = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const node_cron_1 = __importDefault(require("node-cron"));
const history_1 = require("../config/models/history");
const plan_1 = require("../config/models/plan");
const planUser_1 = require("../config/models/planUser");
const user_1 = require("../config/models/user");
exports.activePlanCronJob = () => {
    node_cron_1.default.schedule("* 1 * * *", () => {
        planUser_1.PlanUsers.findAll({ where: { status: planUser_1.IPlanUsersStatus.active } })
            .then(async (activePlans) => {
            activePlans.map(async (planUser) => {
                const plan = await plan_1.Plan.findByPk(planUser.planId);
                const user = await user_1.User.findByPk(planUser.userId);
                const currentTime = dayjs_1.default();
                console.log(currentTime.diff(planUser.createdAt, "hour") % 24);
                if (currentTime.diff(planUser.createdAt, 'hour') % 24 === 0) {
                    if ((plan === null || plan === void 0 ? void 0 : plan.type) === plan_1.planType.plan && planUser.count <= planUser.duration) {
                        let earnings = (planUser.amount * (planUser.rate / 100)) / planUser.duration;
                        planUser.earnings += earnings;
                        planUser.count += 1;
                        user.earnings += earnings;
                        planUser.save();
                        user === null || user === void 0 ? void 0 : user.save();
                    }
                    else if ((plan === null || plan === void 0 ? void 0 : plan.type) === plan_1.planType.stock && planUser.count <= planUser.duration) {
                        let earnings = (planUser.amount * ((Math.floor(Math.random() * 5)) / 100)) / planUser.duration;
                        planUser.earnings += earnings;
                        planUser.count += 1;
                        user.stock += earnings;
                        planUser.save();
                        user === null || user === void 0 ? void 0 : user.save();
                    }
                    else if ((plan === null || plan === void 0 ? void 0 : plan.type) === plan_1.planType.shares && planUser.count <= planUser.duration) {
                        let earnings = (planUser.amount * ((Math.floor(Math.random() * 7)) / 100)) / planUser.duration;
                        planUser.earnings += earnings;
                        planUser.count += 1;
                        user.shares += earnings;
                        planUser.save();
                        user === null || user === void 0 ? void 0 : user.save();
                    }
                    if (planUser.count === planUser.duration || planUser.count > planUser.duration) {
                        planUser.status = planUser_1.IPlanUsersStatus.inactive;
                        const addHistory = await history_1.History.create({
                            userId: planUser.id,
                            slug: Math.random().toString(36).substring(1),
                            reference_id: Math.random().toString(36).substring(3),
                            plan: plan_1.planNames[plan.name],
                            amount: planUser.amount,
                            earnings: planUser.earnings,
                            duration: planUser.duration,
                            status: history_1.historyStatus.accepted,
                            rate: planUser.rate,
                            wallet_balance: user === null || user === void 0 ? void 0 : user.wallet_balance,
                            coin_address: user.coin_address
                        });
                        user.plan = plan_1.planNames.none;
                        user === null || user === void 0 ? void 0 : user.save();
                        planUser.destroy();
                    }
                }
            });
        });
        console.log("running cron job");
    });
};
