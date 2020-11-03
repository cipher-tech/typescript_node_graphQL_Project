import * as Sequelize from "sequelize"
import {sequelize} from '../database/database'
import { planNames } from "./plan"

export enum depositStatus{
    pending = "pending",
    accepted = "accepted"
}
export interface IDeposit {
    id: number
    userId: number
    plan: planNames
    amount: number
    status: depositStatus
    slug: string
    wallet_balance?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IUserDeposit extends Sequelize.Model{
    id: number
    userId: number
    plan: planNames
    amount: number
    status: depositStatus
    slug: string
    wallet_balance?: number;
    createdAt: Date;
    updatedAt: Date;
}

export const Deposit = sequelize.define<IUserDeposit,IDeposit>("Deposit", {
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
})

Deposit.sync().then(() => console.log("Deposits table created"))