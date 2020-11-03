import * as Sequelize from "sequelize"
import { sequelize } from '../database/database'
import { planNames } from "./plan"

export enum userStatus {
    verified = "verified",
    unverified = "unverified"
}

export interface UserAddModel {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_no?: string;
    password?: string | undefined;
    status?: userStatus;
    coin_address?: string;
    wallet_balance?: number;
    plan?: planNames;
    role?: string;
    slug?: string;
    auth_token?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface UserModel extends Sequelize.Model {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_no?: string;
    password?: string | undefined;
    status?: userStatus;
    coin_address?: string;
    wallet_balance?: number;
    plan?: planNames;
    role?: string;
    slug?: string;
    auth_token?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export const User = sequelize.define<UserModel, UserAddModel>('User', {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    first_name: {
        type: new Sequelize.STRING(128),
        allowNull: false,
    },
    last_name: {
        type: new Sequelize.STRING(128),
        allowNull: false,
    },
    email: {
        type: new Sequelize.STRING(128),
        allowNull: false,
    },
    phone_no: {
        type: new Sequelize.STRING(128),
        allowNull: false,
    },
    password: {
        type: new Sequelize.STRING(128),
        allowNull: true,
    },
    status: {
        type: new Sequelize.STRING(128),
        allowNull: true,
    },
    coin_address: {
        type: new Sequelize.STRING(128),
        allowNull: true,
    },
    wallet_balance: {
        type: new Sequelize.INTEGER,
        allowNull: true,
    },
    plan: {
        type: new Sequelize.STRING(128),
        allowNull: true,
    },
    role: {
        type: new Sequelize.STRING(128),
        allowNull: true,
    },
    slug: {
        type: new Sequelize.STRING(128),
        allowNull: true,
    },
    auth_token: {
        type: new Sequelize.STRING(128),
        allowNull: true,
    },
})

// User.sync().then(() => console.log('Users table created'))
