"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanUsers = exports.IPlanUsersStatus = void 0;
const Sequelize = __importStar(require("sequelize"));
const database_1 = require("../database/database");
var IPlanUsersStatus;
(function (IPlanUsersStatus) {
    IPlanUsersStatus["active"] = "active";
    IPlanUsersStatus["inactive"] = "inactive";
})(IPlanUsersStatus = exports.IPlanUsersStatus || (exports.IPlanUsersStatus = {}));
exports.PlanUsers = database_1.sequelize.define("PlanUsers", {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    planId: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    userId: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    amount: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    count: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    duration: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    status: {
        type: new Sequelize.STRING(128),
        allowNull: false,
    },
    rate: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    earnings: {
        type: new Sequelize.INTEGER,
        allowNull: !false,
    },
}, { tableName: "planUsers" });
