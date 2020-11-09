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
import { PlanUsers } from "./planUser"
import { User } from "./user"

const config = {
    tableName: 'plans',
    sequelize: sequelize,
  };
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

interface PlanCreationAttributes extends Optional<IUserPlan, "id"> {}

export class Plan extends Model<IUserPlan, PlanCreationAttributes>
implements IUserPlan{
    public  id!: number;
    public  name!: planNames;
    public  slug!: string;
    public  rate!: number;
    public  from!: number;
    public  to!: number;
    public  type!: planType;
    public  duration!: number;
    public  createdAt!: Date;
    public  updatedAt!: Date;

    public getUser!: HasOneGetAssociationMixin<User>;
}
Plan.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
    },
    
    slug: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    from: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    to: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }, 
    type: {
        type: DataTypes.STRING(128),
        allowNull: false,
    }, 
}, 
config)

Plan.sync().then(() => console.log('Plans table created'))