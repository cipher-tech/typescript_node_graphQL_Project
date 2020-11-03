import * as Sequelize from "sequelize"
import {sequelize} from '../database/database'
import { planNames } from "./plan"

export enum withdrawalStatus{
    pending = "pending",
    accepted = "accepted"
}
export interface IWithdrawal {
    id: number
    userId: number
    plan: planNames
    amount: number
    status: withdrawalStatus
    slug: string
    wallet_balance?: number;
    coin_address: string
    createdAt?: Date;
    updatedAt?: Date;
}

interface IUserWithdrawal extends Sequelize.Model{
    id: number
    userId: number
    plan: planNames
    amount: number
    status: withdrawalStatus
    slug: string
    coin_address: string
    wallet_balance?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export const Withdrawal = sequelize.define<IUserWithdrawal, IWithdrawal>("Withdrawal", {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    plan: {
        type: new Sequelize.STRING(128),
        allowNull: false,
    },
    amount: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    status: {
        type: new Sequelize.STRING(128),
        allowNull: false,
    },
    slug: {
        type: new Sequelize.STRING(128),
        allowNull: false,
    },
    wallet_balance: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    coin_address: {
        type: new Sequelize.STRING(128),
        allowNull: false,
    },
})

Withdrawal.sync().then(() => console.log("Withdrawals table created"))