import {
    Model,
    DataTypes,
    Optional,
    BelongsToManyGetAssociationsMixin,
    BelongsToManyAddAssociationMixin,
    BelongsToManyHasAssociationMixin,
    BelongsToManyCountAssociationsMixin,
    BelongsToManyCreateAssociationMixin,
    BelongsToManySetAssociationsMixin,
    BelongsToManyRemoveAssociationMixin,
  } from "sequelize";
import {sequelize} from '../database/database'
import { planNames } from "./plan"
import { User } from "./user"

const config = {
    tableName: 'withdrawals',
    sequelize: sequelize,
  };
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

interface DepositCreationAttributes extends Optional<IWithdrawal, "id"> {}

export class Withdrawal extends Model<IWithdrawal, DepositCreationAttributes>
implements IWithdrawal{
    public id!: number
    public userId!: number
    public plan!: planNames
    public amount!: number
    public status!: withdrawalStatus
    public slug!: string
    public wallet_balance!: number;
    public coin_address!: string
    public totalWithdrawal?: number
    public createdAt!: Date;
    public updatedAt!: Date;

    public getPlans!: BelongsToManyGetAssociationsMixin<User>; // Note the null assertions!
    public addPlan!: BelongsToManyAddAssociationMixin<User, number>;
    public hasPlan!: BelongsToManyHasAssociationMixin<User, number>;
    public countPlan!: BelongsToManyCountAssociationsMixin;
    public createPlan!: BelongsToManyCreateAssociationMixin<User>;
    public setPlan!: BelongsToManySetAssociationsMixin<User, number>; 
    public removePlan!: BelongsToManyRemoveAssociationMixin<User, number>;

    // public getUser!: HasOneGetAssociationMixin<User>; // Note the null assertions!

}
Withdrawal.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    plan: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    wallet_balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    coin_address: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
},
config)

Withdrawal.sync().then(() => console.log("Withdrawals table created"))