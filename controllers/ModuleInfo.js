import db from "../config/Database.js";
import Banner from "../models/Banner.js";
import Services from "../models/Service.js"


export const getBanner = async(req,res) => {
    try {
        const data = await db.query('SELECT banner_name,banner_image,description FROM banner', {
            type: db.QueryTypes.SELECT
          });
        return res.status(200).json({  status : 0 ,message: "Sukses" ,data: data});
    } catch (error) {
        console.log(error)
    }
}

export const getService = async(req,res) => {
    try {
        const data = await db.query('SELECT service_code,service_name,service_icon,service_tarif FROM services', {
            type: db.QueryTypes.SELECT
          });

        return res.status(200).json({  status : 0 ,message: "Sukses" ,data: data});
    } catch (error) {
        console.log(error)
    }
}