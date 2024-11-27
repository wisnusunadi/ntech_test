import Users from "../models/UserModel.js";
import bcrypt from "bcrypt"
import jwt, { decode } from "jsonwebtoken";




export const updateImage = async(req,res) => {
   
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
      
        if (!req.file) {
            return res.status(400).json({  status : 102 ,message: "Format Image tidak sesuai" ,data:null});
        }
    
       
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    reject(new Error('Token tidak tidak valid atau kadaluwarsa'));
                }
                resolve(decoded);
            });
        });

        await Users.update({profile_image: req.file.filename},{
            where : {
                id : decoded.userId
            }
        })

        const user = await Users.findByPk(decoded.userId)

    
    
        res.status(200).json({
            status : 0 ,
          message: 'Update Profile Image berhasil',
        data: {
          email: user.email,
          first_name : user.first_name,
          last_name : user.last_name,
          profile_image : `${req.protocol}://${req.headers.host}/uploads/${user.profile_image}`
        
        }
        });
     
}


export const updateUsers = async(req,res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const {first_name,last_name} = req.body;


    const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                reject(new Error('Token tidak tidak valid atau kadaluwarsa'));
            }
            resolve(decoded);
        });
    });
     
    
      await Users.update({first_name:first_name,last_name:last_name},{
        where : {
            id : decoded.userId
        }
    })


    const user = await Users.findByPk(decoded.userId)

    
    
    res.status(200).json({
        status : 0 ,
      message: 'Update Berhasil',
    data: {
      email: user.email,
      first_name : user.first_name,
      last_name : user.last_name,
      profile_image : user.profile_image != null ?  `${req.protocol}://${req.headers.host}/uploads/${user.profile_image}` : null
    
    }
    });

}




export const getUsers = async(req,res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    const decoded = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                reject(new Error('Token tidak tidak valid atau kadaluwarsa'));
            }
            resolve(decoded);
        });
    });


    const user = await Users.findByPk(decoded.userId)

    res.status(200).json({
        status : 0 ,
      message: 'Sukses',
    data: {
      email: user.email,
      first_name : user.first_name,
      last_name : user.last_name,
      profile_image : user.profile_image != null ?  `${req.protocol}://${req.headers.host}/uploads/${user.profile_image}` : null
    
    }
    });


   
}

export const registerUsers = async(req,res) => {
    //Email Sudah Ada
    
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const {email,first_name,last_name,password} = req.body;
    const existingUser = await Users.findOne({
        where: { email: email }
      });

      
    if (existingUser) {
        return res.status(400).json({  status : 102 ,message: "Email terpakai" ,data: null});
      }
      
    if (email && !emailRegexp.test(email)) {
        return res.status(400).json({  status : 102 ,message: "Parameter email tidak sesuai format" ,data: null});
      }
      
      if (password && password.length < 8 ||  password.length === 0 ) {
        return res.status(400).json({  status : 102 ,message: "Password minimal 8 karakter" ,data: null});
      }

      if (!first_name || first_name.trim() === '') {
        return res.status(400).json({  status : 102 ,message: "First name tidak boleh kosong" });
      }
      
      if (!last_name || last_name.trim() === '') {
        return res.status(400).json({  status : 102 ,message: "Last name tidak boleh kosong" });
      }
      
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password,salt);

    try {
        await Users.create({
            first_name : first_name,
            last_name : last_name,
            email : email,
            password : hashPassword
        })

        return res.status(200).json({ status : 0 ,message: "Registrasi berhasil silahkan login" ,data: null});
    } catch (error) {
        return res.status(500).json({  status : 102 ,message: "Kesalahan Server" ,data: null});
    }
    

}


export const Login = async(req,res) => {

    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const {email,first_name,last_name,password} = req.body;

    if (email && !emailRegexp.test(email)) {
        return res.status(400).json({  status : 102 ,message: "Parameter email tidak sesuai format" ,data: null});
      }

    try {
        const user = await Users.findAll({
            where : {
                email : req.body.email
            }
        })
        const match = await bcrypt.compare(req.body.password,user[0].password)
        if(!match)   return res.status(401).json({  status : 103  ,message: "Email atau password salah" ,data: null});

        //res.status(200).json({message: "ok"})
        const userId = user[0].id
        const first_name = user[0].first_name;
        const last_name = user[0].last_name;
        const email = user[0].email
        const profile_image = user[0].profile_image
      

        //console.log(userId)

        const accesToken = jwt.sign({userId,first_name,last_name,email,profile_image},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn : '1d'
        })
        const refreshToken = jwt.sign({userId,first_name,last_name,email,profile_image},process.env.REFRESH_TOKEN_SECRET,{
            expiresIn : '1d'
        })

        await Users.update({refresh_token:refreshToken},{
            where : {
                id : userId
            }
        })

        res.cookie('refreshToken', refreshToken,{
            httpOnly : true,
            maxAge : 24 * 60 * 60 * 1000
            // secure :true
        })

       return res.status(200).json({  status : 0  ,message: "Login Sukses" ,data: {token : accesToken}});
    } catch (error) {
        return res.status(401).json({  status : 103  ,message: "Email atau password salah" ,data: null});
    }
}