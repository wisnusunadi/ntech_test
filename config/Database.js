import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();
const db = new Sequelize(process.env.DB_DATABASE,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
    host :process.env.DB_HOSTNAME,
    dialect : "mysql",
    define: {
        timestamps: false
    }
})

export default db;