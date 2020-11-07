import * as Sequelize from "sequelize"
import { Association, HasOneGetAssociationMixin, HasOneCreateAssociationMixin } from 'sequelize';

import { sequelize } from '../database/database'
import { Deposit } from "./deposit"
import { History } from "./history"
import { Plan, planNames } from "./plan"
import { PlanUsers } from "./planUser"
import { Withdrawal } from "./withdrawal"

const config = {
    tableName: 'users',
    sequelize: sequelize,
  };
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

export class User extends Sequelize.Model{
   public id?: number;
   public first_name?: string;
   public last_name?: string;
   public email?: string;
   public phone_no?: string;
   public password?: string | undefined;
   public status?: userStatus;
   public coin_address?: string;
   public wallet_balance?: number;
   public plan?: planNames;
   public role?: string;
   public slug?: string;
   public auth_token?: string;
   public readonly createdAt?: Date;
   public readonly updatedAt?: Date;
}
User.init({
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
}, 
config)


User.sync().then(() => console.log('Users table created'))
