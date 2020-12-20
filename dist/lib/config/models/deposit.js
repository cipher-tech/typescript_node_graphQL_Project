"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deposit = exports.depositStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database/database");
const config = {
    tableName: 'deposits',
    sequelize: database_1.sequelize,
};
var depositStatus;
(function (depositStatus) {
    depositStatus["pending"] = "pending";
    depositStatus["accepted"] = "accepted";
    depositStatus["canceled"] = "canceled";
})(depositStatus = exports.depositStatus || (exports.depositStatus = {}));
class Deposit extends sequelize_1.Model {
}
exports.Deposit = Deposit;
Deposit.init({
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
}, config);
