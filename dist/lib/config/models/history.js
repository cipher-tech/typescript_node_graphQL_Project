"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.History = exports.historyStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database/database");
const config = {
    tableName: 'histories',
    sequelize: database_1.sequelize,
};
var historyStatus;
(function (historyStatus) {
    historyStatus["pending"] = "pending";
    historyStatus["accepted"] = "accepted";
})(historyStatus = exports.historyStatus || (exports.historyStatus = {}));
class History extends sequelize_1.Model {
}
exports.History = History;
History.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    reference_id: {
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
    earnings: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    rate: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
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
