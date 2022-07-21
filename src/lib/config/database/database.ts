import {Sequelize} from 'sequelize';

export const sequelize = new Sequelize('digitalDreams', 'root', '', {
    dialect: 'mysql',
    host: 'localhost',
});