import {
    Sequelize,
    Model,
    ModelDefined,
    DataTypes,
    HasManyGetAssociationsMixin,
    HasManyAddAssociationMixin,
    HasManyHasAssociationMixin,
    Association,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasOneGetAssociationMixin, 
    HasOneCreateAssociationMixin,
    Optional,
  } from "sequelize";
import {sequelize} from '../database/database'
import { planNames } from "./plan"
import { User } from "./user"

const config = {
    tableName: 'histories',
    sequelize: sequelize,
  };
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

interface DepositCreationAttributes extends Optional<IHistory, "id"> {}

export class History extends Model<IHistory, DepositCreationAttributes>
implements IHistory{
    public  id!: number
    public  userId!: number
    public  slug!: string 
    public  reference_id!: string 
    public  plan!: planNames
    public  amount!: number
    public  earnings!: number
    public  duration!: number
    public  rate!: number
    public  status!: historyStatus
    public  wallet_balance!: number;
    public  coin_address!: string
    public  createdAt!: Date;
    public  updatedAt!: Date;

    public getUser!: HasOneGetAssociationMixin<User>; // Note the null assertions!
}

History.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    reference_id: {
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
    earnings: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
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

History.sync().then(() => console.log("History table created"))