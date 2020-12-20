import {
    Sequelize,
    Model,
    ModelDefined,
    DataTypes,
    HasOneGetAssociationMixin, 
    HasOneCreateAssociationMixin,
    Optional,
  } from "sequelize";
import {sequelize} from '../database/database'
import { planNames } from "./plan"
import { User } from "./user"

const config = {
    tableName: 'deposits',
    sequelize: sequelize,
  };
export enum depositStatus{
    pending = "pending",
    accepted = "accepted",
    canceled = "canceled"
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
interface DepositCreationAttributes extends Optional<IDeposit, "id"> {}
export class Deposit extends Model<IDeposit, DepositCreationAttributes>
implements IDeposit{
    public id!: number;
    public userId!: number
    public plan!: planNames
    public amount!: number
    public status!: depositStatus
    public slug!: string
    public wallet_balance?: number;
    public createdAt?: Date;
    public updatedAt?: Date;
    public totalDeposits?: number
    public getUser!: HasOneGetAssociationMixin<User>; // Note the null assertions!

}
Deposit.init ({
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
},
config)

// Deposit.sync().then(() => console.log("Deposits table created"))