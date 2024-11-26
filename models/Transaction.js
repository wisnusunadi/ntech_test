import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Transaction = db.define('transactions',{
    user_id : {
        type : DataTypes.INTEGER
    },
    invoice_number : {
        type : DataTypes.STRING
    },
    transaction_type : {
        type : DataTypes.STRING
    },
    description : {
        type : DataTypes.STRING
    },
    total_amount : {
        type : DataTypes.INTEGER
    },
    created_on : {
        type : DataTypes.TIME
    },
},{
    freezeTableName :true
})

export default Transaction