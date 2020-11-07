import { Deposit } from "./deposit"
import { History } from "./history"
import { Plan } from "./plan"
import { PlanUsers } from "./planUser"
import { User } from "./user"
import { Withdrawal } from "./withdrawal"

export function modelAssociation() {

    History.belongsTo(User)

    Withdrawal.belongsTo(User)

    Deposit.belongsTo(User)

    User.hasMany(Deposit)
    User.hasMany(History)
    User.hasMany(Withdrawal)
    
    User.belongsToMany(Plan, { through: PlanUsers })
    Plan.belongsToMany(User, { through: PlanUsers })
    console.log("ok");

}

