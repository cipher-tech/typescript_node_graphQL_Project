"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Roles = exports.userStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database/database");
const config = {
    tableName: 'users',
    sequelize: database_1.sequelize,
};
var userStatus;
(function (userStatus) {
    userStatus["verified"] = "verified";
    userStatus["unverified"] = "unverified";
})(userStatus = exports.userStatus || (exports.userStatus = {}));
var Roles;
(function (Roles) {
    Roles["user"] = "user";
    Roles["admin"] = "admin";
})(Roles = exports.Roles || (exports.Roles = {}));
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    first_name: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        unique: true
    },
    phone_no: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    earnings: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    stock: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    shares: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    status: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    coin_address: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    wallet_balance: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    plan: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    auth_token: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
}, config);
