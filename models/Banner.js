import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Banner = db.define('banner',{
    banner_name : {
        type : DataTypes.STRING
    },
    banner_image : {
        type : DataTypes.STRING
    },
    description : {
        type : DataTypes.STRING
    },
},{
    freezeTableName :true
})

export default Banner