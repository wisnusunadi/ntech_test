import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();
const db = new Sequelize(process.env.DB_HOSTNAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
    host : "localhost",
    dialect : "mysql",
    define: {
        timestamps: false
    }
})

export default db;