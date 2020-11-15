import { Deposit } from "./deposit"
import { History } from "./history"
import { Plan } from "./plan"
import { PlanUsers } from "./planUser"
import { User } from "./user"
import { Withdrawal } from "./withdrawal"

export function modelAssociation() {

    History.belongsTo(User)

    Withdrawal.belongsTo(User,  {targetKey: 'id', 
    foreignKey: 'userId',
    as: "users"})

    Deposit.belongsTo(User, {targetKey: 'id', 
    foreignKey: 'userId',
    as: "users"})

    User.hasMany(Deposit,{
        sourceKey: 'id',
        foreignKey: 'userId',
        as: 'deposits' // this determines the name in `associations`!
      })
    User.hasMany(History, {
      sourceKey: 'id',
        foreignKey: 'userId',
        as: 'histories' // this determines the name in `associations`!
    })

    User.hasMany(Withdrawal,{
      sourceKey: 'id',
        foreignKey: 'userId',
        as: 'withdrawals' // this determines the name in `associations`!
    })
    
    User.belongsToMany(Plan, { through: PlanUsers })
    Plan.belongsToMany(User, { through: PlanUsers })
    // console.log("ok");

}

