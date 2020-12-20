"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelAssociation = void 0;
const deposit_1 = require("./deposit");
const history_1 = require("./history");
const plan_1 = require("./plan");
const planUser_1 = require("./planUser");
const user_1 = require("./user");
const withdrawal_1 = require("./withdrawal");
function modelAssociation() {
    history_1.History.belongsTo(user_1.User);
    withdrawal_1.Withdrawal.belongsTo(user_1.User, { targetKey: 'id',
        foreignKey: 'userId',
        as: "users" });
    deposit_1.Deposit.belongsTo(user_1.User, { targetKey: 'id',
        foreignKey: 'userId',
        as: "users" });
    user_1.User.hasMany(deposit_1.Deposit, {
        sourceKey: 'id',
        foreignKey: 'userId',
        as: 'deposits'
    });
    user_1.User.hasMany(history_1.History, {
        sourceKey: 'id',
        foreignKey: 'userId',
        as: 'histories'
    });
    user_1.User.hasMany(withdrawal_1.Withdrawal, {
        sourceKey: 'id',
        foreignKey: 'userId',
        as: 'withdrawals'
    });
    user_1.User.belongsToMany(plan_1.Plan, { through: planUser_1.PlanUsers });
    plan_1.Plan.belongsToMany(user_1.User, { through: planUser_1.PlanUsers });
}
exports.modelAssociation = modelAssociation;
