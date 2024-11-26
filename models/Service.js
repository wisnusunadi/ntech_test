import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Service = db.define('services',{
    service_code : {
        type : DataTypes.STRING
    },
    service_icon : {
        type : DataTypes.TEXT
    },
    service_tarif : {
        type : DataTypes.DECIMAL
    },
    service_name : {
        type : DataTypes.STRING
    },
},{
    freezeTableName :true
})

export default Service