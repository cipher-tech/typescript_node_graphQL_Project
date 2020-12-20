"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdrawal = exports.withdrawalStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database/database");
const config = {
    tableName: 'withdrawals',
    sequelize: database_1.sequelize,
};
var withdrawalStatus;
(function (withdrawalStatus) {
    withdrawalStatus["pending"] = "pending";
    withdrawalStatus["accepted"] = "accepted";
    withdrawalStatus["canceled"] = "canceled";
})(withdrawalStatus = exports.withdrawalStatus || (exports.withdrawalStatus = {}));
class Withdrawal extends sequelize_1.Model {
}
exports.Withdrawal = Withdrawal;
Withdrawal.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    plan: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    wallet_balance: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    coin_address: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
}, config);
