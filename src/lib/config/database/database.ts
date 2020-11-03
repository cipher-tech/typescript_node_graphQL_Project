import {Sequelize} from 'sequelize';

export const sequelize = new Sequelize('aramco', 'root', '', {
    dialect: 'mysql',
    host: 'localhost',
});