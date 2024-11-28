import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
import mysql2 from 'mysql2'
dotenv.config();
const db = new Sequelize({
    host :process.env.DB_HOSTNAME,
    username : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
    dialect : "mysql",
    dialectModule :mysql2,
    define: {
        timestamps: false
    }
})


export default db;