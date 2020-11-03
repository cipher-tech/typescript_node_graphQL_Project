import * as Sequelize from "sequelize"
import {sequelize} from '../database/database'

enum IPlanUsersStatus {
    active = "active",
    inactive = "inactive"
}
export interface IPlanUsers {
    id: number
    planId: number
    userId: number
    amount: number
    count: number
    duration: number
    status: IPlanUsersStatus
    earnings: number
    rate: number
    createdAt?: Date;
    updatedAt?: Date;
}

interface IPlanUser extends IPlanUsers, Sequelize.Model{
    id: number
    planId: number
    userId: number
    amount: number
    count: number
    duration: number
    status: IPlanUsersStatus
    earnings: number
    rate: number
}

export const PlanUsers = sequelize.define<IPlanUser, IPlanUsers>("PlanUsers", {
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
        allowNull: false,
    },
})

PlanUsers.sync().then(() => console.log("PlanUsers table created"))