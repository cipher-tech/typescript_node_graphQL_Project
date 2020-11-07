import * as Sequelize from "sequelize"
import {sequelize} from '../database/database'
import { planNames } from "./plan"
import { User } from "./user"

export enum historyStatus{
    pending = "pending",
    accepted = "accepted"
}
export interface IHistory{
    id: number
    userId: number
    slug: string 
    reference_id: string 
    plan: planNames
    amount: number
    earnings: number
    duration: number
    rate: number
    status: historyStatus
    wallet_balance?: number;
    coin_address: string
    createdAt?: Date;
    updatedAt?: Date;
}

interface IUserHistory extends Sequelize.Model {
    id: number
    userId: number
    slug: string 
    reference_id: string 
    plan: planNames
    amount: number
    earnings: number
    duration: number
    rate: number
    status: historyStatus
    wallet_balance?: number;
    coin_address: string
    createdAt: Date;
    updatedAt: Date;
}

export const History = sequelize.define<IUserHistory, IHistory>("History", {
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    slug: {
        type: new Sequelize.STRING(128),
        allowNull: false,
    },
    reference_id: {
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
    earnings: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    duration: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    rate: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    status: {
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

History.sync().then(() => console.log("History table created"))