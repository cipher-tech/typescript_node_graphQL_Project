"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plan = exports.planNames = exports.planType = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database/database");
const config = {
    tableName: 'plans',
    sequelize: database_1.sequelize,
};
var planType;
(function (planType) {
    planType["plan"] = "plan";
    planType["shares"] = "shares";
    planType["stock"] = "stock";
})(planType = exports.planType || (exports.planType = {}));
var planNames;
(function (planNames) {
    planNames["gas"] = "gas";
    planNames["crude oil"] = "crude oil";
    planNames["Refined Product"] = "Refined Product";
    planNames["Power Systems"] = "Power Systems";
    planNames["Chemicals"] = "Chemicals";
    planNames["Large Cap Stock"] = "Large Cap Stock";
    planNames["Mid Cap Stocks"] = "Mid Cap Stocks";
    planNames["Blue Chip Stocks"] = "Blue Chip Stocks";
    planNames["Redeemable Shares"] = "Redeemable Shares";
    planNames["Equity Shares"] = "Equity Shares";
    planNames["none"] = "none";
})(planNames = exports.planNames || (exports.planNames = {}));
class Plan extends sequelize_1.Model {
}
exports.Plan = Plan;
Plan.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    slug: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    rate: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    from: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    to: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
}, config);
