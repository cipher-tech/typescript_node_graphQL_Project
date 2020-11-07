import * as Sequelize from "sequelize"
import {sequelize} from '../database/database'
import { PlanUsers } from "./planUser"
import { User } from "./user"

export enum planType{
    plan = "plan",
    shares = "shares",
    stock = "stock"
}
export enum planNames {
    gas           = "gas",
    "crude oil"            = "crude oil",
    "Refined Product"            = "Refined Product",
    "Power Systems"     = "Power Systems",
    Chemicals           = "Chemicals",
    "Large Cap Stock"   = "Large Cap Stock",
    "Mid Cap Stocks"    = "Mid Cap Stocks",
    "Blue Chip Stocks"  = "Blue Chip Stocks",
    "Redeemable Shares" = "Redeemable Shares",
    "Equity Shares"     = "Equity Shares",
    none = "none",
}
export interface IUserPlan {
    id: number;
    name: planNames;
    slug: string;
    rate: number;
    from: number;
    to: number;
    type: planType;
    duration: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IPlanInterface extends Sequelize.Model {
    id: number;
    name: planNames;
    slug: string;
    rate: number;
    from: number;
    to: number;
    duration: number;
    type: planType;
    createdAt: Date;
    updatedAt: Date;
}

export const Plan = sequelize.define<IPlanInterface, IUserPlan>("Plan",{
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: new Sequelize.STRING(128),
        allowNull: false,
    },
    
    slug: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    rate: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    from: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    to: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    },
    duration: {
        type: new Sequelize.INTEGER,
        allowNull: false,
    }, 
    type: {
        type: new Sequelize.STRING(128),
        allowNull: false,
    }, 
})

Plan.sync().then(() => console.log('Plans table created'))