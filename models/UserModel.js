import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Users = db.define('users',{
    first_name : {
        type : DataTypes.STRING
    },
    last_name : {
        type : DataTypes.STRING
    },
    email : {
        type : DataTypes.STRING
    },
    password : {
        type : DataTypes.TEXT
    },
    profile_image : {
        type : DataTypes.TEXT
    },
    balance : {
        type : DataTypes.DECIMAL(10,2),
    },
    refresh_token : {
        type : DataTypes.TEXT
    },

},{
    freezeTableName :true
})

export default Users