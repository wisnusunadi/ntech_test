
import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken"

export const refreshToken = async(req,res) => {
    try {
        const refreshToken = req.cookies.refresh_token
        if(!refreshToken)  return res.status(401).json({  status : 108  ,message: "Token tidak tidak valid atau kadaluwarsa" ,data: null});
        const user =  await Users.findAll({
            where : {
                refresh_token : refreshToken
            }
        })

        if(!user[0]) return res.status(401).json({  status : 108  ,message: "Token tidak tidak valid atau kadaluwarsa" ,data: null});

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
            if(err) return res.status(401).json({  status : 108  ,message: "Token tidak tidak valid atau kadaluwarsa" ,data: null});

            const first_name = user[0].first_name;
            const last_name = user[0].last_name;
            const email = user[0].email
            const profile_image = user[0].profile_image

            const accessToken = jwt.sign({first_name,last_name,email,profile_image},process.env.ACCESS_TOKEN_SECRET,{
                expiresIn : '20s'
            })
            res.json({
                accessToken
            })
        })



    } catch (error) {
        console.log(error)
    }
}