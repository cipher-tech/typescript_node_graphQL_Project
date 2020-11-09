import {
    Sequelize,
    Model,
    ModelDefined,
    DataTypes,
    Association,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManySetAssociationsMixin,
    HasManyRemoveAssociationMixin,

    BelongsToManyGetAssociationsMixin,
    BelongsToManyAddAssociationMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyCountAssociationsMixin,
    BelongsToManyCreateAssociationMixin,
    BelongsToManySetAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
    
    Optional,
} from "sequelize";

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
export enum Roles{
    user = "user",
    admin = "admin"
}
// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAddModel, "id" | "plan"> { }
export class User extends Model<UserAddModel, UserCreationAttributes>
    implements UserAddModel {

    public id?: number;
    public first_name?: string;
    public last_name?: string;
    public email?: string;
    public phone_no?: string;
    public password?: string | undefined;
    public status!: userStatus;
    public coin_address?: string;
    public wallet_balance?: number;
    public plan?: planNames;
    public role?: Roles;
    public slug?: string;
    public auth_token?: string;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;


    // Since TS cannot determine model association at compile time
    // we have to declare them here purely virtually
    // these will not exist until `Model.init` was called.
    public getDeposits!: HasManyGetAssociationsMixin<Deposit>; // Note the null assertions!
    public addDeposit!: HasManyAddAssociationMixin<Deposit, number>;
    public hasDeposit!: HasManyHasAssociationMixin<Deposit, number>;
    public countDeposits!: HasManyCountAssociationsMixin;
    public createDeposit!: HasManyCreateAssociationMixin<Deposit>;
    public setDeposit!: HasManySetAssociationsMixin<Deposit, number>; 
    public removeDeposit!: HasManyRemoveAssociationMixin<Deposit, number>;

    public getHistories!: HasManyGetAssociationsMixin<History>; // Note the null assertions!
    public addHistory!: HasManyAddAssociationMixin<History, number>;
    public hasHistory!: HasManyHasAssociationMixin<History, number>;
    public createHistory!: HasManyCreateAssociationMixin<History>;
    public setHistory!: HasManySetAssociationsMixin<History, number>; 
    public removeHistory!: HasManyRemoveAssociationMixin<History, number>;

    public getWithdrawals!: HasManyGetAssociationsMixin<Withdrawal>; // Note the null assertions!
    public addWithdrawal!: HasManyAddAssociationMixin<Withdrawal, number>;
    public hasWithdrawal!: HasManyHasAssociationMixin<Withdrawal, number>;
    public createWithdrawal!: HasManyCreateAssociationMixin<Withdrawal>;
    public setWithdrawal!: HasManySetAssociationsMixin<Withdrawal, number>; 
    public removeWithdrawal!: HasManyRemoveAssociationMixin<Withdrawal, number>;

    public getPlans!: BelongsToManyGetAssociationsMixin<Plan>; // Note the null assertions!
    public addPlan!: BelongsToManyAddAssociationMixin<Plan, number>;
    public hasPlan!: BelongsToManyHasAssociationMixin<Plan, number>;
    public countPlan!: BelongsToManyCountAssociationsMixin;
    public createPlan!: BelongsToManyCreateAssociationMixin<Plan>;
    public setPlan!: BelongsToManySetAssociationsMixin<Plan, number>; 
    public removePlan!: BelongsToManyRemoveAssociationMixin<Plan, number>;

    public readonly Deposits?: Deposit[]; // Note this is optional since it's only populated when explicitly requested in code    
    public static associations: {
        Deposits: Association<User, Deposit>;
    };

}
User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    phone_no: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    coin_address: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    wallet_balance: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    plan: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    slug: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    auth_token: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
},
    config)


User.sync().then(() => console.log('Users table created'))
